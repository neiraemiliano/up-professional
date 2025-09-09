// Offline Storage Utility for PWA Data Synchronization
export class OfflineStorage {
  constructor(storeName = 'pwa-offline-data', version = 1) {
    this.storeName = storeName;
    this.version = version;
    this.db = null;
    this.isSupported = this.checkSupport();
    this.initPromise = this.init();
  }

  checkSupport() {
    return 'indexedDB' in window;
  }

  async init() {
    if (!this.isSupported) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.storeName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('timestamp', 'timestamp');
        }

        if (!db.objectStoreNames.contains('queue')) {
          const queueStore = db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
          queueStore.createIndex('timestamp', 'timestamp');
          queueStore.createIndex('type', 'type');
        }

        if (!db.objectStoreNames.contains('drafts')) {
          const draftsStore = db.createObjectStore('drafts', { keyPath: 'id', autoIncrement: true });
          draftsStore.createIndex('timestamp', 'timestamp');
          draftsStore.createIndex('type', 'type');
        }
      };
    });
  }

  // Cache Management
  async setCache(key, data, ttl = 3600000) { // Default TTL: 1 hour
    await this.initPromise;
    
    const item = {
      key,
      data,
      timestamp: Date.now(),
      ttl,
      expires: Date.now() + ttl
    };

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      return store.put(item);
    } else {
      // Fallback to localStorage
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(item));
      } catch (e) {
        console.warn('localStorage cache storage failed:', e);
      }
    }
  }

  async getCache(key) {
    await this.initPromise;

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const item = request.result;
          if (item && item.expires > Date.now()) {
            resolve(item.data);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      // Fallback to localStorage
      try {
        const item = localStorage.getItem(`cache_${key}`);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed.expires > Date.now()) {
            return parsed.data;
          }
        }
      } catch (e) {
        console.warn('localStorage cache retrieval failed:', e);
      }
      return null;
    }
  }

  async clearExpiredCache() {
    await this.initPromise;

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const index = store.index('timestamp');
      
      return new Promise((resolve) => {
        const now = Date.now();
        const request = index.openCursor();
        
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const item = cursor.value;
            if (item.expires < now) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
      });
    } else {
      // Cleanup localStorage cache
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (item.expires < Date.now()) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            localStorage.removeItem(key);
          }
        }
      });
    }
  }

  // Queue Management for offline operations
  async queueOperation(type, data, retryCount = 0) {
    await this.initPromise;

    const operation = {
      type,
      data,
      timestamp: Date.now(),
      retryCount,
      status: 'pending'
    };

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['queue'], 'readwrite');
      const store = transaction.objectStore('queue');
      return store.add(operation);
    } else {
      // Fallback to localStorage queue
      const queue = this.getLocalStorageQueue();
      const id = Date.now() + Math.random();
      queue[id] = operation;
      localStorage.setItem('offline_queue', JSON.stringify(queue));
    }
  }

  async getQueuedOperations() {
    await this.initPromise;

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['queue'], 'readonly');
      const store = transaction.objectStore('queue');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } else {
      // Fallback to localStorage
      const queue = this.getLocalStorageQueue();
      return Object.values(queue);
    }
  }

  async removeFromQueue(id) {
    await this.initPromise;

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['queue'], 'readwrite');
      const store = transaction.objectStore('queue');
      return store.delete(id);
    } else {
      // Remove from localStorage queue
      const queue = this.getLocalStorageQueue();
      delete queue[id];
      localStorage.setItem('offline_queue', JSON.stringify(queue));
    }
  }

  getLocalStorageQueue() {
    try {
      return JSON.parse(localStorage.getItem('offline_queue') || '{}');
    } catch (e) {
      return {};
    }
  }

  // Draft Management
  async saveDraft(type, data) {
    await this.initPromise;

    const draft = {
      type,
      data,
      timestamp: Date.now(),
      autoSaved: true
    };

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      return store.put(draft);
    } else {
      // Fallback to localStorage
      const drafts = this.getLocalStorageDrafts();
      const id = Date.now();
      drafts[id] = draft;
      localStorage.setItem('drafts', JSON.stringify(drafts));
    }
  }

  async getDrafts(type = null) {
    await this.initPromise;

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['drafts'], 'readonly');
      const store = transaction.objectStore('drafts');
      
      if (type) {
        const index = store.index('type');
        return new Promise((resolve, reject) => {
          const request = index.getAll(type);
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });
      } else {
        return new Promise((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });
      }
    } else {
      // Fallback to localStorage
      const drafts = this.getLocalStorageDrafts();
      const allDrafts = Object.values(drafts);
      return type ? allDrafts.filter(draft => draft.type === type) : allDrafts;
    }
  }

  getLocalStorageDrafts() {
    try {
      return JSON.parse(localStorage.getItem('drafts') || '{}');
    } catch (e) {
      return {};
    }
  }

  // Utility Methods
  async getStorageInfo() {
    const info = {
      isSupported: this.isSupported,
      storeName: this.storeName,
      version: this.version
    };

    if (this.isSupported && this.db) {
      // Get storage usage if available
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        info.quota = estimate.quota;
        info.usage = estimate.usage;
        info.usagePercentage = estimate.usage / estimate.quota * 100;
      }
    }

    return info;
  }

  async clearAll() {
    await this.initPromise;

    if (this.isSupported && this.db) {
      const transaction = this.db.transaction(['cache', 'queue', 'drafts'], 'readwrite');
      await Promise.all([
        transaction.objectStore('cache').clear(),
        transaction.objectStore('queue').clear(),
        transaction.objectStore('drafts').clear()
      ]);
    } else {
      // Clear localStorage data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_') || key === 'offline_queue' || key === 'drafts') {
          localStorage.removeItem(key);
        }
      });
    }
  }
}

// React Hooks for Offline Storage
export const useOfflineStorage = () => {
  const [storage] = useState(() => new OfflineStorage());
  
  return storage;
};

// Offline Queue Hook
export const useOfflineQueue = () => {
  const storage = useOfflineStorage();
  const [queue, setQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    const operations = await storage.getQueuedOperations();
    setQueue(operations);
  };

  const processQueue = async (apiClient) => {
    if (isProcessing || !navigator.onLine) return;

    setIsProcessing(true);
    const operations = await storage.getQueuedOperations();

    for (const operation of operations) {
      try {
        // Process the operation based on type
        switch (operation.type) {
          case 'POST':
            await apiClient.post(operation.data.url, operation.data.body);
            break;
          case 'PUT':
            await apiClient.put(operation.data.url, operation.data.body);
            break;
          case 'DELETE':
            await apiClient.delete(operation.data.url);
            break;
          default:
            console.warn('Unknown operation type:', operation.type);
        }

        // Remove successful operation from queue
        await storage.removeFromQueue(operation.id);
        await loadQueue();

      } catch (error) {
        console.error('Failed to process queued operation:', error);
        // Optionally increment retry count or remove after max retries
      }
    }

    setIsProcessing(false);
  };

  return {
    queue,
    queueOperation: async (type, data) => {
      await storage.queueOperation(type, data);
      await loadQueue();
    },
    processQueue,
    isProcessing,
    clearQueue: async () => {
      await storage.clearAll();
      await loadQueue();
    }
  };
};

export default OfflineStorage;
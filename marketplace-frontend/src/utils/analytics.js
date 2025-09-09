import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generate or get session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get user ID from local storage or auth context
const getUserId = () => {
  try {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  return null;
};

// Analytics tracking class
class Analytics {
  constructor() {
    this.queue = [];
    this.isOnline = navigator.onLine;
    this.sessionId = getSessionId();
    this.setupEventListeners();
    this.startPeriodicFlush();
  }

  setupEventListeners() {
    // Track online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushQueue(); // Flush when user leaves
      }
    });

    // Flush queue before page unload
    window.addEventListener('beforeunload', () => {
      this.flushQueue();
    });
  }

  startPeriodicFlush() {
    // Temporarily disable periodic flush to fix loops
    // setInterval(() => {
    //   if (this.queue.length > 0 && this.isOnline) {
    //     this.flushQueue();
    //   }
    // }, 30000);
  }

  async track(eventData) {
    const enrichedData = {
      ...eventData,
      sessionId: this.sessionId,
      userId: eventData.userId || getUserId(),
      timestamp: new Date().toISOString(),
      metadata: {
        ...eventData.metadata,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    // Add to queue
    this.queue.push(enrichedData);

    // If queue is getting full or user is about to leave, flush immediately
    if (this.queue.length >= 10) {
      await this.flushQueue();
    }
  }

  async flushQueue() {
    if (this.queue.length === 0 || !this.isOnline) {
      return;
    }

    const events = [...this.queue];
    this.queue = [];

    try {
      await axios.post(`${API_BASE}/analytics/events`, {
        events: events.length === 1 ? events[0] : { bulk: events }
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue for retry (but limit to avoid infinite growth)
      if (this.queue.length < 50) {
        this.queue.unshift(...events);
      }
    }
  }

  // Convenience methods
  trackPageView(page, metadata = {}) {
    this.track({
      eventType: 'page_view',
      category: 'navigation',
      action: 'view',
      label: page,
      metadata: {
        page,
        title: document.title,
        ...metadata
      }
    });
  }

  trackSearch(query, resultCount = 0, category = null, metadata = {}) {
    this.track({
      eventType: 'search',
      category: 'search',
      action: 'search',
      label: query,
      value: resultCount,
      metadata: {
        query,
        resultCount,
        category,
        ...metadata
      }
    });
  }

  trackClick(element, elementType = 'button', metadata = {}) {
    this.track({
      eventType: 'click',
      category: 'interaction',
      action: 'click',
      label: elementType,
      metadata: {
        element: element.tagName.toLowerCase(),
        elementId: element.id,
        elementClass: element.className,
        text: element.textContent?.substring(0, 100),
        ...metadata
      }
    });
  }

  trackProfessionalContact(professionalId, contactMethod, metadata = {}) {
    this.track({
      eventType: 'professional_contact',
      category: 'professional',
      action: 'contact',
      label: contactMethod,
      professionalId: parseInt(professionalId),
      metadata: {
        contactMethod,
        ...metadata
      }
    });
  }

  trackBookingCreation(bookingId, bookingValue = 0, metadata = {}) {
    this.track({
      eventType: 'booking_created',
      category: 'booking',
      action: 'create',
      value: bookingValue,
      bookingId: parseInt(bookingId),
      metadata
    });
  }

  trackUserRegistration(userRole, metadata = {}) {
    this.track({
      eventType: 'user_registration',
      category: 'user',
      action: 'create',
      metadata: {
        role: userRole,
        ...metadata
      }
    });
  }

  trackError(error, context = {}) {
    this.track({
      eventType: 'error',
      category: 'system',
      action: 'error',
      label: error.message,
      metadata: {
        error: error.toString(),
        stack: error.stack,
        context,
        url: window.location.href
      }
    });
  }

  trackPerformance(metric, value, metadata = {}) {
    this.track({
      eventType: 'performance',
      category: 'system',
      action: 'metric',
      label: metric,
      value: value,
      metadata: {
        metric,
        ...metadata
      }
    });
  }

  // Method to track time spent on page
  trackTimeOnPage(pagePath) {
    const startTime = Date.now();
    
    const trackExit = () => {
      const timeSpent = Date.now() - startTime;
      this.track({
        eventType: 'time_on_page',
        category: 'engagement',
        action: 'time',
        label: pagePath,
        value: Math.round(timeSpent / 1000), // Convert to seconds
        metadata: {
          timeSpent,
          page: pagePath
        }
      });
    };

    // Track when user leaves the page
    window.addEventListener('beforeunload', trackExit, { once: true });
    
    // Also track on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackExit();
      }
    }, { once: true });

    return trackExit; // Return function to manually trigger if needed
  }
}

// Create singleton instance
const analytics = new Analytics();

// React hook for easy usage
export const useAnalytics = () => {
  return {
    track: (eventData) => analytics.track(eventData),
    trackPageView: (page, metadata) => analytics.trackPageView(page, metadata),
    trackSearch: (query, resultCount, category, metadata) => 
      analytics.trackSearch(query, resultCount, category, metadata),
    trackClick: (element, elementType, metadata) => 
      analytics.trackClick(element, elementType, metadata),
    trackProfessionalContact: (professionalId, contactMethod, metadata) => 
      analytics.trackProfessionalContact(professionalId, contactMethod, metadata),
    trackBookingCreation: (bookingId, bookingValue, metadata) => 
      analytics.trackBookingCreation(bookingId, bookingValue, metadata),
    trackUserRegistration: (userRole, metadata) => 
      analytics.trackUserRegistration(userRole, metadata),
    trackError: (error, context) => analytics.trackError(error, context),
    trackPerformance: (metric, value, metadata) => 
      analytics.trackPerformance(metric, value, metadata),
    trackTimeOnPage: (pagePath) => analytics.trackTimeOnPage(pagePath)
  };
};

// Auto-track page views for React Router
export const trackPageView = (location) => {
  analytics.trackPageView(location.pathname + location.search, {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash
  });
};

// Auto-track clicks on specific elements
export const setupAutoTracking = () => {
  // Track all button clicks
  document.addEventListener('click', (event) => {
    const target = event.target.closest('button, a[href], [data-track]');
    if (target) {
      const trackingData = target.dataset.track ? JSON.parse(target.dataset.track) : {};
      analytics.trackClick(target, target.tagName.toLowerCase(), trackingData);
    }
  });

  // Track form submissions
  document.addEventListener('submit', (event) => {
    const form = event.target;
    analytics.track({
      eventType: 'form_submit',
      category: 'form',
      action: 'submit',
      label: form.name || form.id || 'unnamed_form',
      metadata: {
        formId: form.id,
        formName: form.name,
        action: form.action
      }
    });
  });

  // Track scroll depth
  let maxScrollDepth = 0;
  let scrollTimer;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollDepth = (scrollTop + windowHeight) / documentHeight;
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
    }
    
    // Debounce scroll tracking
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (maxScrollDepth > 0.25) { // Only track if user scrolled at least 25%
        analytics.trackPerformance('scroll_depth', Math.round(maxScrollDepth * 100), {
          depth: maxScrollDepth,
          page: window.location.pathname
        });
      }
    }, 1000);
  });
};

export default analytics;
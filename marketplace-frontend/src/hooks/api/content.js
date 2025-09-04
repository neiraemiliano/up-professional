import { useState, useEffect, useCallback } from 'react';
import contentAPI from '../../api/content';

// Hook para obtener contenido público
export const useContent = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getAllContent();
      if (response.success) {
        setContent(response.data);
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Función helper para obtener valor de contenido con fallback
  const getContent = useCallback((key, fallback = '') => {
    return content[key]?.value || fallback;
  }, [content]);

  // Función helper para obtener metadata
  const getContentMetadata = useCallback((key) => {
    return content[key]?.metadata || {};
  }, [content]);

  return {
    content,
    loading,
    error,
    getContent,
    getContentMetadata,
    refetch: fetchContent
  };
};

// Hook para obtener contenido por categoría
export const useContentByCategory = (category) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        const response = await contentAPI.getContentByCategory(category);
        if (response.success) {
          setContent(response.data);
        }
      } catch (err) {
        setError(err);
        console.error('Error fetching content by category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [category]);

  return { content, loading, error };
};

// Hook para anuncios
export const useAnnouncements = (params = {}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getActiveAnnouncements(params);
      if (response.success) {
        setAnnouncements(response.data);
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const trackClick = useCallback(async (id) => {
    try {
      await contentAPI.trackAnnouncementClick(id);
    } catch (err) {
      console.error('Error tracking announcement click:', err);
    }
  }, []);

  return {
    announcements,
    loading,
    error,
    trackClick,
    refetch: fetchAnnouncements
  };
};

// Hook para administración de contenido
export const useAdminContent = () => {
  const [content, setContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await contentAPI.getAdminContent(params);
      if (response.success) {
        setContent(response.data.content);
        setCategories(response.data.categories);
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching admin content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createContent = useCallback(async (data) => {
    try {
      const response = await contentAPI.createContent(data);
      if (response.success) {
        await fetchContent();
        return response;
      }
    } catch (err) {
      console.error('Error creating content:', err);
      throw err;
    }
  }, [fetchContent]);

  const updateContent = useCallback(async (id, data) => {
    try {
      const response = await contentAPI.updateContent(id, data);
      if (response.success) {
        await fetchContent();
        return response;
      }
    } catch (err) {
      console.error('Error updating content:', err);
      throw err;
    }
  }, [fetchContent]);

  const resetContent = useCallback(async (id) => {
    try {
      const response = await contentAPI.resetContent(id);
      if (response.success) {
        await fetchContent();
        return response;
      }
    } catch (err) {
      console.error('Error resetting content:', err);
      throw err;
    }
  }, [fetchContent]);

  const deleteContent = useCallback(async (id) => {
    try {
      const response = await contentAPI.deleteContent(id);
      if (response.success) {
        await fetchContent();
        return response;
      }
    } catch (err) {
      console.error('Error deleting content:', err);
      throw err;
    }
  }, [fetchContent]);

  const bulkUpdateContent = useCallback(async (updates) => {
    try {
      const response = await contentAPI.bulkUpdateContent(updates);
      if (response.success) {
        await fetchContent();
        return response;
      }
    } catch (err) {
      console.error('Error bulk updating content:', err);
      throw err;
    }
  }, [fetchContent]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    categories,
    loading,
    error,
    fetchContent,
    createContent,
    updateContent,
    resetContent,
    deleteContent,
    bulkUpdateContent
  };
};

// Hook para administración de anuncios
export const useAdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getAdminAnnouncements();
      if (response.success) {
        setAnnouncements(response.data);
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching admin announcements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAnnouncement = useCallback(async (data) => {
    try {
      const response = await contentAPI.createAnnouncement(data);
      if (response.success) {
        await fetchAnnouncements();
        return response;
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      throw err;
    }
  }, [fetchAnnouncements]);

  const updateAnnouncement = useCallback(async (id, data) => {
    try {
      const response = await contentAPI.updateAnnouncement(id, data);
      if (response.success) {
        await fetchAnnouncements();
        return response;
      }
    } catch (err) {
      console.error('Error updating announcement:', err);
      throw err;
    }
  }, [fetchAnnouncements]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement
  };
};
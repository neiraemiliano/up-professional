import React, { createContext, useContext, useState, useEffect } from 'react';
import { contentAPI } from '../api/content';
import { featureFlagsAPI } from '../api/featureFlags';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [featureFlags, setFeatureFlags] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar todos los datos
  const loadAppData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [contentRes, announcementsRes, featureFlagsRes] = await Promise.allSettled([
        contentAPI.getAllContent(),
        contentAPI.getActiveAnnouncements(),
        featureFlagsAPI.getEnabledMap()
      ]);

      // Procesar contenido
      if (contentRes.status === 'fulfilled') {
        setContent(contentRes.value.data || {});
      } else {
        console.error('Error loading content:', contentRes.reason);
      }

      // Procesar anuncios
      if (announcementsRes.status === 'fulfilled') {
        setAnnouncements(announcementsRes.value.data || []);
      } else {
        console.error('Error loading announcements:', announcementsRes.reason);
      }

      // Procesar feature flags
      if (featureFlagsRes.status === 'fulfilled') {
        setFeatureFlags(featureFlagsRes.value.data || {});
      } else {
        console.error('Error loading feature flags:', featureFlagsRes.reason);
      }

    } catch (err) {
      console.error('Error loading app data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funciones utilitarias
  const getContent = (key, defaultValue = '') => {
    return content[key]?.value || defaultValue;
  };

  const getContentWithMetadata = (key) => {
    return content[key] || null;
  };

  const isFeatureEnabled = (featureId) => {
    return featureFlags[featureId] === true;
  };

  const getAnnouncementsForPage = (page = 'home') => {
    return announcements.filter(announcement => {
      if (!announcement.isActive) return false;
      
      // Verificar fechas
      const now = new Date();
      const startDate = new Date(announcement.startDate);
      const endDate = announcement.endDate ? new Date(announcement.endDate) : null;
      
      if (startDate > now) return false;
      if (endDate && endDate < now) return false;
      
      // Verificar páginas objetivo
      if (announcement.showOnPages && Array.isArray(announcement.showOnPages)) {
        return announcement.showOnPages.includes(page);
      }
      
      return true;
    }).sort((a, b) => b.priority - a.priority);
  };

  // Función para hacer track de clics en anuncios
  const trackAnnouncementClick = async (announcementId) => {
    try {
      await contentAPI.trackAnnouncementClick(announcementId);
    } catch (error) {
      console.error('Error tracking announcement click:', error);
    }
  };

  // Función para refrescar datos
  const refreshContent = () => loadAppData();

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAppData();
  }, []);

  const value = {
    content,
    announcements,
    featureFlags,
    loading,
    error,
    getContent,
    getContentWithMetadata,
    isFeatureEnabled,
    getAnnouncementsForPage,
    trackAnnouncementClick,
    refreshContent,
    loadAppData
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;
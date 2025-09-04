import React, { createContext, useContext } from 'react';
import { useAnnouncements as useAnnouncementsHook } from '../hooks/api/content';

const AnnouncementsContext = createContext({});

export const AnnouncementsProvider = ({ children }) => {
  const { 
    announcements,
    loading,
    error,
    trackClick
  } = useAnnouncementsHook({});

  const getAnnouncementsForPage = (page = 'all') => {
    if (!announcements) return [];
    
    if (page === 'all') return announcements;
    
    return announcements.filter(announcement => {
      if (!announcement.pages) return true;
      return announcement.pages.includes(page) || announcement.pages.includes('all');
    });
  };

  const value = {
    announcements: announcements || [],
    getAnnouncementsForPage,
    trackAnnouncementClick: trackClick,
    loading,
    error
  };

  return (
    <AnnouncementsContext.Provider value={value}>
      {children}
    </AnnouncementsContext.Provider>
  );
};

export const useAnnouncementsContext = () => {
  const context = useContext(AnnouncementsContext);
  if (!context) {
    throw new Error('useAnnouncementsContext must be used within an AnnouncementsProvider');
  }
  return context;
};

export default AnnouncementsContext;
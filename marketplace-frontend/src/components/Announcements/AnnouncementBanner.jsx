import React, { useState } from 'react';
import { X, ExternalLink, Info, AlertTriangle, CheckCircle, XCircle, Megaphone } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AnnouncementBanner = ({ page = 'home', userType = 'all' }) => {
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState(() => {
    // Get dismissed announcements from localStorage
    const dismissed = localStorage.getItem('dismissedAnnouncements');
    return dismissed ? JSON.parse(dismissed) : [];
  });

  const { getAnnouncementsForPage, trackAnnouncementClick, loading } = useContent();
  
  // Get announcements for the specific page
  const allAnnouncements = getAnnouncementsForPage(page);
  
  // Filter by userType if specified
  const announcements = allAnnouncements.filter(announcement => {
    if (userType === 'all') return true;
    return announcement.targetUsers === 'all' || announcement.targetUsers === userType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'promotion':
        return <Megaphone className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    const baseStyles = "border-l-4 p-4 rounded-r-lg";
    
    switch (type) {
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-700`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-700`;
      case 'success':
        return `${baseStyles} bg-green-50 border-green-400 text-green-700`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-400 text-red-700`;
      case 'promotion':
        return `${baseStyles} bg-purple-50 border-purple-400 text-purple-700`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-400 text-gray-700`;
    }
  };

  const handleDismiss = (announcementId) => {
    const newDismissed = [...dismissedAnnouncements, announcementId];
    setDismissedAnnouncements(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
  };

  const handleActionClick = async (announcement) => {
    if (announcement.actionUrl) {
      await trackAnnouncementClick(announcement.id);
      
      if (announcement.actionUrl.startsWith('http')) {
        window.open(announcement.actionUrl, '_blank');
      } else {
        window.location.href = announcement.actionUrl;
      }
    }
  };

  if (loading || !announcements.length) {
    return null;
  }

  // Filter out dismissed announcements
  const activeAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  );

  if (activeAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {activeAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className={getStyles(announcement.type)}
          style={{
            backgroundColor: announcement.backgroundColor || undefined,
            color: announcement.textColor || undefined,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* Icon */}
              <div className="flex-shrink-0">
                {announcement.iconUrl ? (
                  <img 
                    src={announcement.iconUrl} 
                    alt="" 
                    className="w-5 h-5"
                  />
                ) : (
                  getIcon(announcement.type)
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">
                  {announcement.title}
                </h3>
                <p className="text-sm mt-1 opacity-90">
                  {announcement.message}
                </p>

                {/* Action Button */}
                {announcement.actionUrl && announcement.actionText && (
                  <button
                    onClick={() => handleActionClick(announcement)}
                    className="inline-flex items-center space-x-1 mt-3 px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md text-sm font-medium transition-colors"
                  >
                    <span>{announcement.actionText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => handleDismiss(announcement.id)}
              className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
              aria-label="Cerrar anuncio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementBanner;
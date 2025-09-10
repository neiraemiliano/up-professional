// src/components/Notifications/NotificationDisplay.jsx
import React, { memo } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-react';
import { useNotification, NOTIFICATION_TYPES } from '../../context/NotificationContext';

// Notification icons mapping
const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.SUCCESS]: CheckCircle,
  [NOTIFICATION_TYPES.ERROR]: AlertCircle,
  [NOTIFICATION_TYPES.WARNING]: AlertTriangle,
  [NOTIFICATION_TYPES.INFO]: Info,
};

// Notification styling mapping
const NOTIFICATION_STYLES = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-500',
    title: 'text-green-900',
    message: 'text-green-700',
    closeButton: 'text-green-400 hover:text-green-600'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-500',
    title: 'text-red-900',
    message: 'text-red-700',
    closeButton: 'text-red-400 hover:text-red-600'
  },
  [NOTIFICATION_TYPES.WARNING]: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-500',
    title: 'text-yellow-900',
    message: 'text-yellow-700',
    closeButton: 'text-yellow-400 hover:text-yellow-600'
  },
  [NOTIFICATION_TYPES.INFO]: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-500',
    title: 'text-blue-900',
    message: 'text-blue-700',
    closeButton: 'text-blue-400 hover:text-blue-600'
  },
};

// Individual notification component
const NotificationItem = memo(({ notification, onClose }) => {
  const IconComponent = NOTIFICATION_ICONS[notification.type] || Info;
  const styles = NOTIFICATION_STYLES[notification.type] || NOTIFICATION_STYLES[NOTIFICATION_TYPES.INFO];

  return (
    <div className={`relative p-4 rounded-lg border shadow-lg transition-all duration-300 transform hover:scale-102 ${styles.container}`}>
      <div className=\"flex items-start space-x-3\">
        {/* Icon */}
        <div className=\"flex-shrink-0\">
          <IconComponent className={`w-5 h-5 ${styles.icon}`} />
        </div>
        
        {/* Content */}
        <div className=\"flex-1 min-w-0\">
          <h4 className={`text-sm font-semibold ${styles.title}`}>
            {notification.title}
          </h4>
          {notification.message && (
            <p className={`mt-1 text-sm ${styles.message}`}>
              {notification.message}
            </p>
          )}
        </div>
        
        {/* Close button */}
        <div className=\"flex-shrink-0\">
          <button
            onClick={() => onClose(notification.id)}
            className={`inline-flex rounded-md p-1.5 transition-colors duration-200 ${styles.closeButton} hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current`}
            aria-label=\"Cerrar notificación\"
          >
            <X className=\"w-4 h-4\" />
          </button>
        </div>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

// Main notification display component
const NotificationDisplay = memo(() => {
  const { notifications, hideNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className=\"fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full\">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={hideNotification}
        />
      ))}
    </div>
  );
});

NotificationDisplay.displayName = 'NotificationDisplay';

export default NotificationDisplay;
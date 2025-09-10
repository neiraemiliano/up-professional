// src/context/NotificationContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Action types for reducer
const NOTIFICATION_ACTIONS = {
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL'
};

// Notification reducer - enterprise pattern for scalable state management
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SHOW_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: action.payload.id,
            type: action.payload.type,
            title: action.payload.title,
            message: action.payload.message,
            duration: action.payload.duration || 4000,
            timestamp: Date.now()
          }
        ]
      };
    
    case NOTIFICATION_ACTIONS.HIDE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload.id
        )
      };
    
    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: []
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  notifications: []
};

// Create context
const NotificationContext = createContext();

// Custom hook to use notification context with error handling
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Provider component with enterprise-level functionality
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Generate unique ID for notifications
  const generateId = useCallback(() => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Show notification with auto-hide functionality
  const showNotification = useCallback((type, title, message, duration = 4000) => {
    const id = generateId();
    
    dispatch({
      type: NOTIFICATION_ACTIONS.SHOW_NOTIFICATION,
      payload: { id, type, title, message, duration }
    });

    // Auto-hide notification after duration
    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }

    return id; // Return ID for manual control if needed
  }, [generateId]);

  // Hide specific notification
  const hideNotification = useCallback((id) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.HIDE_NOTIFICATION,
      payload: { id }
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((title, message, duration) => {
    return showNotification(NOTIFICATION_TYPES.SUCCESS, title, message, duration);
  }, [showNotification]);

  const showError = useCallback((title, message, duration) => {
    return showNotification(NOTIFICATION_TYPES.ERROR, title, message, duration);
  }, [showNotification]);

  const showWarning = useCallback((title, message, duration) => {
    return showNotification(NOTIFICATION_TYPES.WARNING, title, message, duration);
  }, [showNotification]);

  const showInfo = useCallback((title, message, duration) => {
    return showNotification(NOTIFICATION_TYPES.INFO, title, message, duration);
  }, [showNotification]);

  // Context value with all methods and state
  const contextValue = {
    notifications: state.notifications,
    showNotification,
    hideNotification,
    clearAll,
    // Convenience methods
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
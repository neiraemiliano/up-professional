import React, { useState, useEffect } from 'react';
import {
  Bell,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  MoreVertical
} from 'lucide-react';
import api from '../../api/client';

const PaymentNotifications = ({ userId, isAdmin = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'payment_received', 'subscription_activated', etc.
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin 
        ? `/payments/admin/notifications`
        : `/payments/notifications`;

      const params = new URLSearchParams();
      if (filter !== 'all') {
        if (filter === 'unread') {
          params.append('isRead', 'false');
        } else {
          params.append('type', filter);
        }
      }

      const response = await api.get(`${endpoint}?${params}`);
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await api.post(`/payments/notifications/read`, { notificationIds });

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notificationIds.includes(notif.id)
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (type) {
      case 'payment_received':
        return <DollarSign {...iconProps} className="w-5 h-5 text-green-600" />;
      case 'subscription_activated':
      case 'subscription_renewed':
        return <CheckCircle {...iconProps} className="w-5 h-5 text-blue-600" />;
      case 'payment_failed':
        return <XCircle {...iconProps} className="w-5 h-5 text-red-600" />;
      case 'commission_charged':
        return <CreditCard {...iconProps} className="w-5 h-5 text-orange-600" />;
      case 'subscription_expired':
        return <Clock {...iconProps} className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell {...iconProps} className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'border-red-200 bg-red-50';
    if (priority === 'high') return 'border-orange-200 bg-orange-50';
    
    switch (type) {
      case 'payment_received':
        return 'border-green-200 bg-green-50';
      case 'subscription_activated':
      case 'subscription_renewed':
        return 'border-blue-200 bg-blue-50';
      case 'payment_failed':
        return 'border-red-200 bg-red-50';
      case 'commission_charged':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return past.toLocaleDateString('es-AR');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-20"></div>
        ))}
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Notificaciones de Pagos
          </h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas</option>
          <option value="unread">No leídas</option>
          <option value="payment_received">Pagos recibidos</option>
          <option value="subscription_activated">Suscripciones</option>
          <option value="commission_charged">Comisiones</option>
          <option value="payment_failed">Pagos fallidos</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay notificaciones para mostrar</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                getNotificationColor(notification.type, notification.priority)
              } ${
                !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>

                      {/* Additional Data */}
                      {notification.data && (
                        <div className="mt-2 text-xs space-y-1">
                          {notification.data.amount && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              <span className="font-medium">
                                {formatAmount(notification.data.amount)}
                              </span>
                            </div>
                          )}
                          {notification.data.serviceName && (
                            <div className="text-gray-600">
                              Servicio: {notification.data.serviceName}
                            </div>
                          )}
                          {notification.data.planName && (
                            <div className="text-gray-600">
                              Plan: {notification.data.planName}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(
                            showDropdown === notification.id ? null : notification.id
                          )}
                          className="p-1 hover:bg-white rounded-full transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {showDropdown === notification.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                            {!notification.isRead && (
                              <button
                                onClick={() => {
                                  markAsRead([notification.id]);
                                  setShowDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Marcar leída
                              </button>
                            )}
                            <button
                              onClick={() => {
                                // TODO: Implement delete functionality
                                setShowDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Priority Indicator */}
                  {notification.priority === 'urgent' && (
                    <div className="mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-medium text-red-600">URGENTE</span>
                    </div>
                  )}
                  {notification.priority === 'high' && (
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-xs font-medium text-orange-600">Alta prioridad</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mark All as Read */}
      {unreadCount > 0 && (
        <div className="text-center pt-4">
          <button
            onClick={() => markAsRead(
              notifications.filter(n => !n.isRead).map(n => n.id)
            )}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Marcar todas como leídas
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentNotifications;
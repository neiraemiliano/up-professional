const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationService {
  // Crear notificación de pago
  async createPaymentNotification(data) {
    try {
      const notification = await prisma.paymentNotification.create({
        data: {
          type: data.type,
          userId: data.userId,
          title: data.title,
          message: data.message,
          data: data.data || {},
          priority: data.priority || 'normal'
        }
      });

      console.log('Payment notification created:', notification.id);
      return notification;
    } catch (error) {
      console.error('Error creating payment notification:', error);
      throw error;
    }
  }

  // Obtener notificaciones de un usuario
  async getUserNotifications(userId, filters = {}) {
    try {
      const { isRead, type, limit = 20, offset = 0 } = filters;
      
      const where = { userId };
      if (typeof isRead === 'boolean') where.isRead = isRead;
      if (type) where.type = type;

      const notifications = await prisma.paymentNotification.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: offset
      });

      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Marcar notificaciones como leídas
  async markAsRead(notificationIds, userId = null) {
    try {
      const where = { id: { in: notificationIds } };
      if (userId) where.userId = userId;

      const updated = await prisma.paymentNotification.updateMany({
        where,
        data: {
          isRead: true,
          readAt: new Date()
        }
      });

      return updated;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  // Obtener estadísticas de notificaciones
  async getNotificationStats(userId) {
    try {
      const stats = await prisma.paymentNotification.groupBy({
        by: ['isRead'],
        where: { userId },
        _count: true
      });

      const result = {
        total: 0,
        unread: 0,
        read: 0
      };

      stats.forEach(stat => {
        result.total += stat._count;
        if (stat.isRead) {
          result.read = stat._count;
        } else {
          result.unread = stat._count;
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }

  // Limpiar notificaciones antiguas
  async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deleted = await prisma.paymentNotification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          isRead: true
        }
      });

      console.log(`Cleaned up ${deleted.count} old notifications`);
      return deleted;
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      throw error;
    }
  }

  // Crear notificación para administradores
  async createAdminNotification(type, title, message, data = {}) {
    try {
      const notification = await prisma.paymentNotification.create({
        data: {
          type,
          userId: null, // null para notificaciones de admin
          title,
          message,
          data,
          priority: 'high'
        }
      });

      return notification;
    } catch (error) {
      console.error('Error creating admin notification:', error);
      throw error;
    }
  }

  // Obtener notificaciones para admin dashboard
  async getAdminNotifications(filters = {}) {
    try {
      const { type, limit = 50, offset = 0 } = filters;
      
      const where = { userId: null }; // Solo notificaciones de admin
      if (type) where.type = type;

      const notifications = await prisma.paymentNotification.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: offset
      });

      return notifications;
    } catch (error) {
      console.error('Error getting admin notifications:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
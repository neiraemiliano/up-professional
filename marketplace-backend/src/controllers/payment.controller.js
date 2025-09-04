const PaymentService = require('../services/payment.service');
const NotificationService = require('../services/notification.service');

class PaymentController {
  // ========== SUSCRIPCIONES ==========
  async createSubscriptionPayment(req, res) {
    try {
      const { professionalId, planId } = req.body;
      const userId = req.user.id;

      if (!professionalId || !planId) {
        return res.status(400).json({
          error: 'professionalId y planId son requeridos'
        });
      }

      const payment = await PaymentService.createSubscriptionPayment(
        professionalId,
        planId,
        userId
      );

      res.status(201).json({
        success: true,
        data: payment,
        message: 'Pago de suscripción creado exitosamente'
      });

    } catch (error) {
      console.error('Error creating subscription payment:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  // ========== SERVICIOS ==========
  async createServicePayment(req, res) {
    try {
      const { bookingId, amount, isAdvance = false, advancePercentage = 0.5 } = req.body;

      if (!bookingId || !amount) {
        return res.status(400).json({
          error: 'bookingId y amount son requeridos'
        });
      }

      const payment = await PaymentService.createServicePayment(
        bookingId,
        amount,
        isAdvance,
        advancePercentage
      );

      res.status(201).json({
        success: true,
        data: payment,
        message: 'Pago de servicio creado exitosamente'
      });

    } catch (error) {
      console.error('Error creating service payment:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  // ========== WEBHOOKS ==========
  async handleMercadoPagoWebhook(req, res) {
    try {
      console.log('MercadoPago webhook received:', req.body);
      
      await PaymentService.handleWebhook(req.body);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Error processing webhook' });
    }
  }

  // ========== CONSULTAS ==========
  async getPaymentHistory(req, res) {
    try {
      const { professionalId } = req.params;
      const { type, status, limit = 50, offset = 0 } = req.query;

      // Verificar que el usuario tenga acceso a este profesional
      // Esto se puede mejorar con middleware de autorización
      
      const payments = await PaymentService.getPaymentHistory(
        parseInt(professionalId),
        { type, status, limit: parseInt(limit), offset: parseInt(offset) }
      );

      res.json({
        success: true,
        data: payments,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: payments.length
        }
      });

    } catch (error) {
      console.error('Error getting payment history:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  async getPaymentStats(req, res) {
    try {
      const { professionalId } = req.params;

      const stats = await PaymentService.getPaymentStats(parseInt(professionalId));

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error getting payment stats:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  // ========== NOTIFICACIONES ==========
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { isRead, type, limit = 20, offset = 0 } = req.query;

      const notifications = await NotificationService.getUserNotifications(
        userId,
        { 
          isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
          type,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      );

      res.json({
        success: true,
        data: notifications
      });

    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  async markNotificationsAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { notificationIds } = req.body;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({
          error: 'notificationIds debe ser un array'
        });
      }

      await NotificationService.markAsRead(notificationIds, userId);

      res.json({
        success: true,
        message: 'Notificaciones marcadas como leídas'
      });

    } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  async getNotificationStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await NotificationService.getNotificationStats(userId);

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error getting notification stats:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  // ========== ADMIN ==========
  async getAdminPaymentMetrics(req, res) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // Métricas generales de pagos
      const totalPayments = await prisma.payment.count();
      const approvedPayments = await prisma.payment.count({
        where: { status: 'approved' }
      });

      const revenueStats = await prisma.payment.aggregate({
        where: { status: 'approved' },
        _sum: { amount: true }
      });

      const commissionStats = await prisma.commission.aggregate({
        where: { status: 'collected' },
        _sum: { amount: true }
      });

      // Pagos por tipo
      const paymentsByType = await prisma.payment.groupBy({
        by: ['type'],
        where: { status: 'approved' },
        _count: true,
        _sum: { amount: true }
      });

      // Pagos por método
      const paymentsByMethod = await prisma.payment.groupBy({
        by: ['paymentMethod'],
        where: { status: 'approved' },
        _count: true,
        _sum: { amount: true }
      });

      // Métricas mensuales (últimos 12 meses)
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const monthlyMetrics = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as payment_count,
          SUM("amount") as total_amount,
          COUNT(CASE WHEN "type" = 'subscription' THEN 1 END) as subscription_payments,
          COUNT(CASE WHEN "type" = 'service' THEN 1 END) as service_payments
        FROM "Payment" 
        WHERE "status" = 'approved' 
          AND "createdAt" >= ${twelveMonthsAgo}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 12
      `;

      // Top profesionales por ingresos
      const topProfessionals = await prisma.$queryRaw`
        SELECT 
          p.id,
          u."name",
          u."lastName",
          COUNT(sp.*) as service_count,
          SUM(sp."amount") as total_earnings,
          SUM(sp."platformFee") as total_commissions
        FROM "Professional" p
        JOIN "User" u ON p."userId" = u.id
        JOIN "ServicePayment" sp ON p.id = sp."professionalId"
        WHERE sp."status" = 'paid'
        GROUP BY p.id, u."name", u."lastName"
        ORDER BY total_earnings DESC
        LIMIT 10
      `;

      await prisma.$disconnect();

      res.json({
        success: true,
        data: {
          overview: {
            totalPayments,
            approvedPayments,
            totalRevenue: revenueStats._sum.amount || 0,
            totalCommissions: commissionStats._sum.amount || 0,
            conversionRate: totalPayments > 0 ? (approvedPayments / totalPayments * 100).toFixed(2) : 0
          },
          paymentsByType,
          paymentsByMethod,
          monthlyMetrics,
          topProfessionals
        }
      });

    } catch (error) {
      console.error('Error getting admin payment metrics:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }

  async getAdminNotifications(req, res) {
    try {
      const { type, limit = 50, offset = 0 } = req.query;

      const notifications = await NotificationService.getAdminNotifications({
        type,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: notifications
      });

    } catch (error) {
      console.error('Error getting admin notifications:', error);
      res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }
}

module.exports = new PaymentController();
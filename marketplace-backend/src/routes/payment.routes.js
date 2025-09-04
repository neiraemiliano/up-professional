const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// ========== RUTAS DE SUSCRIPCIONES ==========
router.post('/subscription', authMiddleware, PaymentController.createSubscriptionPayment);

// ========== RUTAS DE SERVICIOS ==========
router.post('/service', authMiddleware, PaymentController.createServicePayment);

// ========== WEBHOOKS ==========
router.post('/webhooks/mercadopago', PaymentController.handleMercadoPagoWebhook);

// ========== CONSULTAS DE PAGOS ==========
router.get('/history/:professionalId', authMiddleware, PaymentController.getPaymentHistory);
router.get('/stats/:professionalId', authMiddleware, PaymentController.getPaymentStats);

// ========== NOTIFICACIONES ==========
router.get('/notifications', authMiddleware, PaymentController.getNotifications);
router.post('/notifications/read', authMiddleware, PaymentController.markNotificationsAsRead);
router.get('/notifications/stats', authMiddleware, PaymentController.getNotificationStats);

// ========== RUTAS ADMIN ==========
router.get('/admin/metrics', authMiddleware, requireRole('admin'), PaymentController.getAdminPaymentMetrics);
router.get('/admin/notifications', authMiddleware, requireRole('admin'), PaymentController.getAdminNotifications);

module.exports = router;
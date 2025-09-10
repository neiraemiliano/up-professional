const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth');
const { validateMercadoPagoWebhook } = require('../middlewares/webhookValidation');

// ========== RUTAS DE SUSCRIPCIONES ==========
router.post('/create-subscription-preference', authMiddleware, PaymentController.createSubscriptionPreference);
router.post('/subscription', authMiddleware, PaymentController.createSubscriptionPayment);

// ========== PROCESAMIENTO DE PAGOS ==========
router.post('/process-success', PaymentController.processPaymentSuccess);
router.post('/process-subscription-success', PaymentController.processPaymentSuccess);

// ========== RUTAS DE SERVICIOS ==========
router.post('/service', authMiddleware, PaymentController.createServicePayment);

// ========== WEBHOOKS ========== 
// Protected webhook with signature verification
router.post('/webhooks/mercadopago', validateMercadoPagoWebhook, PaymentController.handleMercadoPagoWebhook);

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
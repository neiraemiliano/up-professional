const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth');

// Rutas públicas - obtener contenido
router.get('/content', contentController.getAllContent);
router.get('/content/category/:category', contentController.getContentByCategory);
router.get('/content/key/:key', contentController.getContentByKey);
router.get('/announcements', contentController.getActiveAnnouncements);
router.post('/announcements/:id/click', contentController.trackAnnouncementClick);

// Rutas de administración - requieren autenticación y rol admin
router.get('/admin/content', authMiddleware, requireRole('admin'), contentController.getAdminContent);
router.post('/admin/content', authMiddleware, requireRole('admin'), contentController.createContent);
router.put('/admin/content/:id', authMiddleware, requireRole('admin'), contentController.updateContent);
router.post('/admin/content/:id/reset', authMiddleware, requireRole('admin'), contentController.resetContent);
router.delete('/admin/content/:id', authMiddleware, requireRole('admin'), contentController.deleteContent);
router.post('/admin/content/bulk-update', authMiddleware, requireRole('admin'), contentController.bulkUpdateContent);

// Rutas de anuncios - administración
router.get('/admin/announcements', authMiddleware, requireRole('admin'), contentController.getAdminAnnouncements);
router.post('/admin/announcements', authMiddleware, requireRole('admin'), contentController.createAnnouncement);
router.put('/admin/announcements/:id', authMiddleware, requireRole('admin'), contentController.updateAnnouncement);
router.delete('/admin/announcements/:id', authMiddleware, requireRole('admin'), contentController.deleteAnnouncement);

module.exports = router;
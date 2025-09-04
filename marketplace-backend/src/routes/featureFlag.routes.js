// src/routes/featureFlag.routes.js
const express = require('express');
const {
  getAllFeatureFlags,
  getFeatureFlagsByCategory,
  getFeatureFlagById,
  getEnabledFeatureFlags,
  updateFeatureFlag,
  toggleFeatureFlag,
  createFeatureFlag,
  deleteFeatureFlag,
  checkFeatureEnabled,
  getEnabledFeaturesMap,
  getFeatureFlagsGrouped
} = require('../controllers/featureFlag.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/enabled', getEnabledFeatureFlags);
router.get('/enabled-map', getEnabledFeaturesMap);
router.get('/check/:id', checkFeatureEnabled);

// Admin only routes
router.get('/', authMiddleware, requireRole('admin'), getAllFeatureFlags);
router.get('/grouped', authMiddleware, requireRole('admin'), getFeatureFlagsGrouped);
router.get('/category/:category', authMiddleware, requireRole('admin'), getFeatureFlagsByCategory);
router.get('/:id', authMiddleware, requireRole('admin'), getFeatureFlagById);
router.put('/:id', authMiddleware, requireRole('admin'), updateFeatureFlag);
router.post('/:id/toggle', authMiddleware, requireRole('admin'), toggleFeatureFlag);
router.post('/', authMiddleware, requireRole('admin'), createFeatureFlag);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteFeatureFlag);

module.exports = router;
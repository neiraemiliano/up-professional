// src/controllers/featureFlag.controller.js
const FeatureFlagService = require('../services/featureFlag.service');

const featureFlagService = new FeatureFlagService();

const getAllFeatureFlags = async (req, res) => {
  try {
    const featureFlags = await featureFlagService.getAllFeatureFlags();
    res.json({
      success: true,
      data: featureFlags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getFeatureFlagsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const featureFlags = await featureFlagService.getFeatureFlagsByCategory(category);
    res.json({
      success: true,
      data: featureFlags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getFeatureFlagById = async (req, res) => {
  try {
    const { id } = req.params;
    const featureFlag = await featureFlagService.getFeatureFlagById(id);
    res.json({
      success: true,
      data: featureFlag
    });
  } catch (error) {
    if (error.message === 'Feature flag not found') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

const getEnabledFeatureFlags = async (req, res) => {
  try {
    const featureFlags = await featureFlagService.getEnabledFeatureFlags();
    res.json({
      success: true,
      data: featureFlags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const updateFeatureFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeatureFlag = await featureFlagService.updateFeatureFlag(id, req.body);
    res.json({
      success: true,
      data: updatedFeatureFlag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const toggleFeatureFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const toggledFeatureFlag = await featureFlagService.toggleFeatureFlag(id);
    res.json({
      success: true,
      data: toggledFeatureFlag
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

const createFeatureFlag = async (req, res) => {
  try {
    const featureFlag = await featureFlagService.createFeatureFlag(req.body);
    res.status(201).json({
      success: true,
      data: featureFlag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const deleteFeatureFlag = async (req, res) => {
  try {
    const { id } = req.params;
    await featureFlagService.deleteFeatureFlag(id);
    res.json({
      success: true,
      message: 'Feature flag deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Feature flag not found') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

const checkFeatureEnabled = async (req, res) => {
  try {
    const { id } = req.params;
    const isEnabled = await featureFlagService.isFeatureEnabled(id);
    res.json({
      success: true,
      data: { isEnabled }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getEnabledFeaturesMap = async (req, res) => {
  try {
    const featuresMap = await featureFlagService.getEnabledFeaturesMap();
    res.json({
      success: true,
      data: featuresMap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getFeatureFlagsGrouped = async (req, res) => {
  try {
    const groupedFlags = await featureFlagService.getFeatureFlagsGrouped();
    res.json({
      success: true,
      data: groupedFlags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
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
};
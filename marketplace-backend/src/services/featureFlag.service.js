// src/services/featureFlag.service.js
const BaseService = require('./base.service');
const FeatureFlagRepository = require('../repositories/FeatureFlagRepository');

class FeatureFlagService extends BaseService {
  constructor() {
    super();
    this.featureFlagRepository = new FeatureFlagRepository();
  }

  async getAllFeatureFlags() {
    try {
      return await this.featureFlagRepository.findAll();
    } catch (error) {
      throw new Error(`Error getting feature flags: ${error.message}`);
    }
  }

  async getFeatureFlagsByCategory(category) {
    try {
      return await this.featureFlagRepository.findByCategory(category);
    } catch (error) {
      throw new Error(`Error getting feature flags by category: ${error.message}`);
    }
  }

  async getFeatureFlagById(id) {
    try {
      const featureFlag = await this.featureFlagRepository.findById(id);
      if (!featureFlag) {
        throw new Error('Feature flag not found');
      }
      return featureFlag;
    } catch (error) {
      throw new Error(`Error getting feature flag: ${error.message}`);
    }
  }

  async getEnabledFeatureFlags() {
    try {
      return await this.featureFlagRepository.findEnabledFlags();
    } catch (error) {
      throw new Error(`Error getting enabled feature flags: ${error.message}`);
    }
  }

  async updateFeatureFlag(id, data) {
    try {
      // Validate data
      if (data.isEnabled !== undefined && typeof data.isEnabled !== 'boolean') {
        throw new Error('isEnabled must be a boolean value');
      }

      return await this.featureFlagRepository.update(id, data);
    } catch (error) {
      throw new Error(`Error updating feature flag: ${error.message}`);
    }
  }

  async toggleFeatureFlag(id) {
    try {
      return await this.featureFlagRepository.toggleFlag(id);
    } catch (error) {
      throw new Error(`Error toggling feature flag: ${error.message}`);
    }
  }

  async createFeatureFlag(data) {
    try {
      // Validate required fields
      if (!data.id) {
        throw new Error('Feature flag ID is required');
      }
      if (!data.name) {
        throw new Error('Feature flag name is required');
      }

      // Set defaults
      const featureFlagData = {
        id: data.id,
        name: data.name,
        description: data.description || null,
        isEnabled: data.isEnabled || false,
        category: data.category || 'general',
        configData: data.configData || null,
      };

      return await this.featureFlagRepository.create(featureFlagData);
    } catch (error) {
      throw new Error(`Error creating feature flag: ${error.message}`);
    }
  }

  async deleteFeatureFlag(id) {
    try {
      // Check if feature flag exists
      const existingFlag = await this.featureFlagRepository.findById(id);
      if (!existingFlag) {
        throw new Error('Feature flag not found');
      }

      return await this.featureFlagRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting feature flag: ${error.message}`);
    }
  }

  async isFeatureEnabled(flagId) {
    try {
      return await this.featureFlagRepository.isFeatureEnabled(flagId);
    } catch (error) {
      throw new Error(`Error checking if feature is enabled: ${error.message}`);
    }
  }

  async getEnabledFeaturesMap() {
    try {
      return await this.featureFlagRepository.getEnabledFeaturesMap();
    } catch (error) {
      throw new Error(`Error getting enabled features map: ${error.message}`);
    }
  }

  // Helper method for frontend to get feature flags in grouped format
  async getFeatureFlagsGrouped() {
    try {
      const allFlags = await this.featureFlagRepository.findAll();
      
      // Group by category
      const grouped = allFlags.reduce((acc, flag) => {
        const category = flag.category || 'general';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(flag);
        return acc;
      }, {});

      return grouped;
    } catch (error) {
      throw new Error(`Error getting grouped feature flags: ${error.message}`);
    }
  }
}

module.exports = FeatureFlagService;
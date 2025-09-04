// src/api/featureFlags.js
import api from './client';

export const featureFlagsAPI = {
  // ===== PUBLIC ENDPOINTS =====
  
  // Get enabled features (public)
  getEnabled: () => api.get('/feature-flags/enabled').then(r => r.data.data),
  
  // Get enabled features as a map (public)
  getEnabledMap: () => api.get('/feature-flags/enabled-map').then(r => r.data.data),
  
  // Check if a specific feature is enabled (public)
  checkEnabled: (id) => api.get(`/feature-flags/check/${id}`).then(r => r.data.data),
  
  // ===== ADMIN ENDPOINTS =====
  
  // Get all feature flags (admin only)
  getAll: () => api.get('/feature-flags').then(r => r.data.data),
  
  // Get feature flags grouped by category (admin only)
  getGrouped: () => api.get('/feature-flags/grouped').then(r => r.data.data),
  
  // Get feature flags by category (admin only)
  getByCategory: (category) => api.get(`/feature-flags/category/${category}`).then(r => r.data.data),
  
  // Get single feature flag (admin only)
  getById: (id) => api.get(`/feature-flags/${id}`).then(r => r.data.data),
  
  // Create feature flag (admin only)
  create: (data) => api.post('/feature-flags', data).then(r => r.data.data),
  
  // Update feature flag (admin only)
  update: (id, data) => api.put(`/feature-flags/${id}`, data).then(r => r.data.data),
  
  // Toggle feature flag enabled/disabled (admin only)
  toggle: (id) => api.post(`/feature-flags/${id}/toggle`).then(r => r.data.data),
  
  // Delete feature flag (admin only)
  delete: (id) => api.delete(`/feature-flags/${id}`).then(r => r.data),

  // ===== UTILITY FUNCTIONS =====
  
  // Get all categories from grouped flags
  getCategories: async () => {
    const grouped = await featureFlagsAPI.getGrouped();
    return Object.keys(grouped);
  },
  
  // Get flags by status
  getByStatus: async (isEnabled = true) => {
    const flags = await featureFlagsAPI.getAll();
    return flags.filter(flag => flag.isEnabled === isEnabled);
  }
};

export default featureFlagsAPI;
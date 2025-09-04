import api from './client';

export const professionalApi = {
  // Complete professional registration after user creation
  completeRegistration: async (professionalData) => {
    const response = await api.post('/professionals/complete-registration', professionalData);
    return response.data;
  },

  // Get professional profile
  getProfile: async (id) => {
    const response = await api.get(`/professionals/${id}`);
    return response.data;
  },

  // Update professional profile
  updateProfile: async (id, data) => {
    const response = await api.put(`/professionals/${id}`, data);
    return response.data;
  },

  // Get professional dashboard data
  getDashboard: async () => {
    const response = await api.get('/professionals/dashboard');
    return response.data;
  },

  // Upload portfolio images
  uploadPortfolio: async (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });
    
    const response = await api.post('/professionals/portfolio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get professional services
  getServices: async () => {
    const response = await api.get('/professionals/services');
    return response.data;
  },

  // Create new service
  createService: async (serviceData) => {
    const response = await api.post('/professionals/services', serviceData);
    return response.data;
  },

  // Update service
  updateService: async (id, serviceData) => {
    const response = await api.put(`/professionals/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await api.delete(`/professionals/services/${id}`);
    return response.data;
  }
};
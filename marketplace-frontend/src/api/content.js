import client from './client';

export const contentAPI = {
  // Obtener todo el contenido público
  getAllContent: async () => {
    const response = await client.get('/content');
    return response.data;
  },

  // Obtener contenido por categoría
  getContentByCategory: async (category) => {
    const response = await client.get(`/content/category/${category}`);
    return response.data;
  },

  // Obtener contenido por key
  getContentByKey: async (key) => {
    const response = await client.get(`/content/key/${key}`);
    return response.data;
  },

  // Obtener anuncios activos
  getActiveAnnouncements: async (params = {}) => {
    const response = await client.get('/announcements', { params });
    return response.data;
  },

  // Registrar clic en anuncio
  trackAnnouncementClick: async (id) => {
    const response = await client.post(`/announcements/${id}/click`);
    return response.data;
  },

  // ===== ADMIN ENDPOINTS =====
  
  // Obtener contenido para administración
  getAdminContent: async (params = {}) => {
    const response = await client.get('/admin/content', { params });
    return response.data;
  },

  // Crear contenido
  createContent: async (data) => {
    const response = await client.post('/admin/content', data);
    return response.data;
  },

  // Actualizar contenido
  updateContent: async (id, data) => {
    const response = await client.put(`/admin/content/${id}`, data);
    return response.data;
  },

  // Restaurar contenido a valor por defecto
  resetContent: async (id) => {
    const response = await client.post(`/admin/content/${id}/reset`);
    return response.data;
  },

  // Eliminar contenido
  deleteContent: async (id) => {
    const response = await client.delete(`/admin/content/${id}`);
    return response.data;
  },

  // Actualización masiva
  bulkUpdateContent: async (updates) => {
    const response = await client.post('/admin/content/bulk-update', { updates });
    return response.data;
  },

  // ===== ADMIN ANNOUNCEMENTS =====
  
  // Obtener anuncios para administración
  getAdminAnnouncements: async () => {
    const response = await client.get('/admin/announcements');
    return response.data;
  },

  // Crear anuncio
  createAnnouncement: async (data) => {
    const response = await client.post('/admin/announcements', data);
    return response.data;
  },

  // Actualizar anuncio
  updateAnnouncement: async (id, data) => {
    const response = await client.put(`/admin/announcements/${id}`, data);
    return response.data;
  },

  // Eliminar anuncio
  deleteAnnouncement: async (id) => {
    const response = await client.delete(`/admin/announcements/${id}`);
    return response.data;
  }
};

export default contentAPI;
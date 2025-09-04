import api from "./client";

export const fetchProfessionals = (filters = {}) =>
  api.get("/professionals", { params: filters }).then((r) => r.data);

export const searchProfessionals = (filters = {}) =>
  api.get("/professionals/search", { params: filters }).then((r) => r.data);

export const fetchProfessional = (id) =>
  api.get(`/professionals/${id}`).then((r) => r.data);
  
export const fetchProfessionalProfile = (id) =>
  api.get(`/professionals/${id}/profile`).then((r) => r.data);

export const createProfessional = (data) =>
  api.post("/professionals", data).then((r) => r.data);

export const updateProfessional = (id, data) =>
  api.put(`/professionals/${id}`, data).then((r) => r.data);

export const deleteProfessional = (id) => api.delete(`/professionals/${id}`);

export const generateWhatsAppURL = (id, data) =>
  api.post(`/professionals/${id}/whatsapp`, data).then((r) => r.data);

export const checkWhatsAppAvailability = (id) =>
  api.get(`/professionals/${id}/whatsapp/check`).then((r) => r.data);

// Intelligent Search API
export const intelligentSearch = (params) =>
  api.get("/intelligent-search/search", { params }).then((r) => r.data);

export const getSmartSuggestions = (params = {}) =>
  api.get("/intelligent-search/suggestions", { params }).then((r) => r.data);

export const analyzeQuery = (params) =>
  api.get("/intelligent-search/analyze", { params }).then((r) => r.data);

export const submitSearchFeedback = (data) =>
  api.post("/intelligent-search/feedback", data).then((r) => r.data);

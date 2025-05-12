import api from "./client";

export const fetchProfessionals = (filters = {}) =>
  api.get("/professionals", { params: filters }).then((r) => r.data);
export const fetchProfessional = (id) =>
  api.get(`/professionals/${id}`).then((r) => r.data);
export const createProfessional = (data) =>
  api.post("/professionals", data).then((r) => r.data);
export const updateProfessional = (id, data) =>
  api.put(`/professionals/${id}`, data).then((r) => r.data);
export const deleteProfessional = (id) => api.delete(`/professionals/${id}`);

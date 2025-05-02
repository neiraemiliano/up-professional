import api from "./client";

export const fetchServices = () => api.get("/services").then((r) => r.data);
export const fetchService = (id) =>
  api.get(`/services/${id}`).then((r) => r.data);
export const createService = (data) =>
  api.post("/services", data).then((r) => r.data);
export const updateService = (id, data) =>
  api.put(`/services/${id}`, data).then((r) => r.data);
export const deleteService = (id) => api.delete(`/services/${id}`);

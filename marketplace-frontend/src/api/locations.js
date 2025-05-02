import api from "./client";

export const fetchLocations = () => api.get("/locations").then((r) => r.data);
export const fetchLocation = (id) =>
  api.get(`/locations/${id}`).then((r) => r.data);
export const createLocation = (data) =>
  api.post("/locations", data).then((r) => r.data);
export const updateLocation = (id, data) =>
  api.put(`/locations/${id}`, data).then((r) => r.data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`);

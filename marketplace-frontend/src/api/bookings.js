import api from "./client";

export const fetchBookings = () => api.get("/bookings").then((r) => r.data);
export const fetchBooking = (id) =>
  api.get(`/bookings/${id}`).then((r) => r.data);
export const createBooking = (data) =>
  api.post("/bookings", data).then((r) => r.data);
export const updateBooking = (id, data) =>
  api.put(`/bookings/${id}`, data).then((r) => r.data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

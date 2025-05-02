import api from "./client";

export const fetchReviews = () => api.get("/reviews").then((r) => r.data);
export const fetchReview = (id) =>
  api.get(`/reviews/${id}`).then((r) => r.data);
export const createReview = (data) =>
  api.post("/reviews", data).then((r) => r.data);
export const updateReview = (id, data) =>
  api.put(`/reviews/${id}`, data).then((r) => r.data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

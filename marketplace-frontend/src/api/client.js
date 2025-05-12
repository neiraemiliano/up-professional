// ================================
// 1. API CLIENT
// src/api/client.js
// ================================
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response.status === 401) localStorage.removeItem("token");
    return Promise.reject(err.response.data);
  }
);

export default api;

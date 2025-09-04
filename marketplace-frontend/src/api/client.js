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
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirigir a login si estamos en una página protegida
      if (window.location.pathname.includes('admin') || window.location.pathname.includes('dashboard')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default api;

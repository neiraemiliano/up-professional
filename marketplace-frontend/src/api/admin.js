import api from "./client";

// Dashboard principal con todas las estadísticas
export const fetchDashboardStats = () =>
  api.get("/admin/dashboard").then((r) => r.data.data);

// Métricas específicas por área
export const fetchUserMetrics = (period = "30d") =>
  api.get("/admin/metrics/users", { params: { period } }).then((r) => r.data.data);

export const fetchProfessionalMetrics = () =>
  api.get("/admin/metrics/professionals").then((r) => r.data.data);

export const fetchBookingMetrics = (period = "30d") =>
  api.get("/admin/metrics/bookings", { params: { period } }).then((r) => r.data.data);

export const fetchFinancialMetrics = () =>
  api.get("/admin/metrics/financial").then((r) => r.data.data);

export const fetchContactMetrics = () =>
  api.get("/admin/metrics/contacts").then((r) => r.data.data);

// Actividad reciente
export const fetchRecentActivity = () =>
  api.get("/admin/activity/recent").then((r) => r.data.data);

// Exportación de datos
export const exportData = (type = "overview", format = "json") =>
  api.get("/admin/export", { params: { type, format } }).then((r) => r.data.data);

// Configuración del sistema
export const fetchSystemConfig = () =>
  api.get("/admin/system/config").then((r) => r.data.data);

// Funciones de usuario existentes (mantener compatibilidad)
export const fetchAllUsers = () =>
  api.get("/admin/users").then((r) => r.data.data);

export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role }).then((r) => r.data.data);
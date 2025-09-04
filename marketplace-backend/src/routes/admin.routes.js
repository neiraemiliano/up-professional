// src/routes/admin.routes.js
const router = require("express").Router();
const { getAllUsers, updateUser } = require("../controllers/user.controller");
const adminController = require("../controllers/admin.controller");

// Rutas de usuario (existentes)
router
  .get("/users", getAllUsers) // ver todos los usuarios
  .put("/users/:id/role", updateUser); // cambiar el role de un usuario

// Dashboard principal con overview completo
router.get("/dashboard", adminController.getDashboardOverview);

// Métricas específicas por área
router.get("/metrics/users", adminController.getUserMetrics);
router.get("/metrics/professionals", adminController.getProfessionalMetrics);
router.get("/metrics/bookings", adminController.getBookingMetrics);
router.get("/metrics/financial", adminController.getFinancialMetrics);
router.get("/metrics/contacts", adminController.getContactMetrics);

// Actividad del sistema
router.get("/activity/recent", adminController.getRecentActivity);

// Exportación de datos
router.get("/export", adminController.exportData);

// Configuración del sistema
router.get("/system/config", adminController.getSystemConfig);

module.exports = router;

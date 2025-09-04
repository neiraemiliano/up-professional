const express = require("express");
const router = express.Router();
const urgentController = require("../controllers/urgent.controller");
const { authMiddleware } = require("../middlewares/auth");

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear reserva urgente (clientes)
router.post("/", urgentController.createUrgentBooking);

// Obtener reservas urgentes del profesional
router.get("/professional", urgentController.getUrgentBookingsForProfessional);

// Confirmar reserva urgente (profesional)
router.patch("/:id/confirm", urgentController.confirmUrgentBooking);

// Rechazar reserva urgente (profesional)
router.patch("/:id/reject", urgentController.rejectUrgentBooking);

// Estadísticas de reservas urgentes (profesional)
router.get("/stats", urgentController.getUrgentStats);

module.exports = router;
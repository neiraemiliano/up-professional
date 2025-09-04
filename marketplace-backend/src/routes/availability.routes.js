const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/availability.controller");
const { authMiddleware } = require("../middlewares/auth");

// Rutas públicas - para consultar disponibilidad
router.get("/professional/:professionalId", availabilityController.getProfessionalSchedule);
router.get("/professional/:professionalId/current", availabilityController.checkCurrentAvailability);
router.get("/professional/:professionalId/upcoming", availabilityController.getUpcomingAvailability);

// Rutas con autenticación - para profesionales
router.put("/", authMiddleware, availabilityController.updateSchedule);

module.exports = router;
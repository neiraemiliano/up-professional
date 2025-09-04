// src/routes/professional.routes.js
const router = require("express").Router();
const professionalController = require("../controllers/professional.controller");
const { authMiddleware, requireRole } = require("../middlewares/auth");

// Complete professional registration (any authenticated user)
router.post("/complete-registration", authMiddleware, professionalController.completeRegistration);

// Professional dashboard (professional role required) - must be before /:id route
router.get("/dashboard", authMiddleware, requireRole("professional"), professionalController.getDashboard);

// Rutas públicas
router.get("/search", professionalController.searchProfessionals);
router.get("/:id/profile", professionalController.getFullProfile);

// Rutas de WhatsApp
router.post("/:id/whatsapp", professionalController.generateWhatsAppURL);
router.get("/:id/whatsapp/check", professionalController.checkWhatsAppAvailability);

// Rutas originales
router
  .get("/", professionalController.getAll)
  .get("/:id", professionalController.getById)
  .post("/", professionalController.create)
  .put("/:id", professionalController.update)
  .delete("/:id", professionalController.delete);

// Rutas con autenticación
router.patch("/urgent-settings", authMiddleware, professionalController.updateUrgentSettings);

module.exports = router;

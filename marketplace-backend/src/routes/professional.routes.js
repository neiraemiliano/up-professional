// src/routes/professional.routes.js
const router = require("express").Router();
const professionalController = require("../controllers/professional.controller");
const { authMiddleware, requireRole } = require("../middlewares/auth");

// Complete professional registration (any authenticated user)
router.post("/complete-registration", authMiddleware, professionalController.completeRegistration);

// Professional dashboard (professional role required) - must be before /:id route
router.get("/dashboard", authMiddleware, requireRole("professional"), professionalController.getDashboard);

// Onboarding status routes (authenticated users)
router.get("/onboarding-status", authMiddleware, professionalController.checkOnboardingStatus);
router.post("/complete-onboarding", authMiddleware, professionalController.markOnboardingComplete);

// Rutas públicas
router.get("/search", professionalController.searchProfessionals);
router.get("/:id/profile", professionalController.getFullProfile);

// Rutas de WhatsApp
router.post("/:id/whatsapp", professionalController.generateWhatsAppURL);
router.get("/:id/whatsapp/check", professionalController.checkWhatsAppAvailability);

// Rutas originales - Protected CRUD operations
router
  .get("/", professionalController.getAll) // Public for listing professionals
  .get("/:id", professionalController.getById) // Public for viewing profiles
  .post("/", authMiddleware, requireRole("admin"), professionalController.create) // Admin only
  .put("/:id", authMiddleware, professionalController.update) // Auth required for updates
  .delete("/:id", authMiddleware, requireRole("admin"), professionalController.delete); // Admin only

// Rutas con autenticación
router.patch("/urgent-settings", authMiddleware, professionalController.updateUrgentSettings);

module.exports = router;

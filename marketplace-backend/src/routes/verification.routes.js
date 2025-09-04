const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verification.controller");
const { authMiddleware } = require("../middlewares/auth");

// Rutas públicas
router.get("/professional/:professionalId/status", verificationController.getVerificationStatus);
router.get("/verified-professionals", verificationController.getVerifiedProfessionals);

// Rutas con autenticación - para profesionales
router.post("/request", authMiddleware, verificationController.requestVerification);
router.get("/my-requests", authMiddleware, verificationController.getMyVerificationRequests);

module.exports = router;
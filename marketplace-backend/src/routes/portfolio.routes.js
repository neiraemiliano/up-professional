const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolio.controller");
const { authMiddleware } = require("../middlewares/auth");

// Obtener portfolio de un profesional (público)
router.get("/professional/:professionalId", portfolioController.getPortfolio);

// Las siguientes rutas requieren autenticación
router.use(authMiddleware);

// Agregar imagen al portfolio (solo profesional dueño)
router.post("/", portfolioController.addPortfolioImage);

// Actualizar imagen del portfolio
router.patch("/:id", portfolioController.updatePortfolioImage);

// Eliminar imagen del portfolio
router.delete("/:id", portfolioController.deletePortfolioImage);

// Reordenar portfolio
router.patch("/reorder", portfolioController.reorderPortfolio);

// Estadísticas del portfolio
router.get("/stats", portfolioController.getPortfolioStats);

module.exports = router;
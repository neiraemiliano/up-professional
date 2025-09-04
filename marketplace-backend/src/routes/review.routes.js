// src/routes/review.routes.js
const router = require("express").Router();
const reviewController = require("../controllers/review.controller");
const { authMiddleware, requireRole } = require("../middlewares/auth");

// Rutas básicas CRUD
router
  .get("/", reviewController.getAll)
  .get("/:id", reviewController.getById)
  .post("/", authMiddleware, requireRole("customer"), reviewController.create)
  .put("/:id", authMiddleware, reviewController.update)
  .delete("/:id", authMiddleware, reviewController.delete);

// Rutas específicas para funcionalidades avanzadas
router.get("/professional/:professionalId", reviewController.getByProfessional);
router.get("/professional/:professionalId/stats", reviewController.getStats);
router.get("/professional/:professionalId/aspects", reviewController.getAspectAnalysis);
router.get("/professional/:professionalId/recent", reviewController.getRecent);
router.post("/:id/helpful", authMiddleware, reviewController.markHelpful);

module.exports = router;

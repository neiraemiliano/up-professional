const router = require("express").Router();
const intelligentSearchController = require("../controllers/intelligentSearch.controller");

// Rutas públicas
router.get("/search", intelligentSearchController.intelligentSearch);
router.get("/suggestions", intelligentSearchController.getSmartSuggestions);
router.get("/analyze", intelligentSearchController.analyzeQuery);

// Rutas con feedback
router.post("/feedback", intelligentSearchController.submitSearchFeedback);

module.exports = router;
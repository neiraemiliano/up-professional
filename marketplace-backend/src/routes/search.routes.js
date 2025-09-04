const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

// Rutas públicas
router.get("/suggestions/category/:categoryId", searchController.getSuggestionsByCategory);
router.get("/suggestions/intelligent", searchController.intelligentSearch);
router.get("/suggestions/popular", searchController.getPopularSuggestions);

// Incrementar popularidad (no requiere auth)
router.patch("/suggestions/:id/popularity", searchController.incrementSuggestionPopularity);

// Estimación de precios
router.post("/estimate-price", searchController.estimatePrice);

// Procesamiento de búsqueda por voz
router.post("/voice-search", searchController.processVoiceSearch);

module.exports = router;
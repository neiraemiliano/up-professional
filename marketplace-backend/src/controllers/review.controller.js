// src/controllers/review.controller.js
const generateController = require("./base.controller");
const reviewService = require("../services/review.service");

const baseController = generateController(reviewService);

// Controladores específicos para reviews
const reviewController = {
  ...baseController,

  // Crear una nueva reseña
  async create(req, res) {
    try {
      const reviewData = {
        userId: req.user.id, // Asumiendo que viene del middleware de auth
        professionalId: parseInt(req.body.professionalId),
        rating: parseInt(req.body.rating),
        comment: req.body.comment,
        aspectRatings: req.body.aspectRatings,
        isAnonymous: req.body.isAnonymous || false,
        wouldRecommend: req.body.wouldRecommend !== undefined ? req.body.wouldRecommend : true,
        serviceDate: req.body.serviceDate ? new Date(req.body.serviceDate) : null,
        service: req.body.service
      };

      const review = await reviewService.createReview(reviewData);
      res.status(201).json({
        success: true,
        data: review,
        message: 'Reseña creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener reseñas de un profesional
  async getByProfessional(req, res) {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const filters = req.query;

      const reviews = await reviewService.getFilteredReviews(professionalId, filters);
      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener estadísticas de reseñas
  async getStats(req, res) {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const stats = await reviewService.getReviewStats(professionalId);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener análisis de aspectos
  async getAspectAnalysis(req, res) {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const analysis = await reviewService.getAspectAnalysis(professionalId);
      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener reseñas recientes
  async getRecent(req, res) {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const limit = parseInt(req.query.limit) || 5;
      const reviews = await reviewService.getRecentReviews(professionalId, limit);
      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Marcar reseña como útil
  async markHelpful(req, res) {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await reviewService.markHelpful(reviewId);
      res.json({
        success: true,
        data: review,
        message: 'Reseña marcada como útil'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = reviewController;

// src/services/review.service.js
const BaseService = require("./base.service");
const reviewRepo = require("../repositories/ReviewRepository");

class ReviewService extends BaseService {
  constructor() {
    super(reviewRepo);
  }

  // Métodos específicos de Review
  async createReview(data) {
    // Validar datos requeridos
    if (!data.userId || !data.professionalId || !data.rating) {
      throw new Error('userId, professionalId y rating son requeridos');
    }

    // Validar rating entre 1-5
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('El rating debe estar entre 1 y 5');
    }

    // Procesar aspectRatings si existe
    if (data.aspectRatings) {
      // Asegurar que sea un objeto válido
      if (typeof data.aspectRatings !== 'object') {
        throw new Error('aspectRatings debe ser un objeto');
      }
    }

    const review = await this.repo.create(data);

    // Actualizar el promedio de rating del profesional
    await this.updateProfessionalRating(data.professionalId);

    return review;
  }

  async getReviewsByProfessional(professionalId) {
    return await this.repo.findByProfessionalId(professionalId);
  }

  async getReviewStats(professionalId) {
    const [stats, distribution] = await Promise.all([
      this.repo.getReviewStats(professionalId),
      this.repo.getRatingDistribution(professionalId)
    ]);

    return {
      totalReviews: stats._count.rating,
      averageRating: stats._avg.rating || 0,
      ratingDistribution: distribution
    };
  }

  async getRecentReviews(professionalId, limit = 5) {
    return await this.repo.getRecentReviews(professionalId, limit);
  }

  async markHelpful(reviewId) {
    return await this.repo.incrementHelpful(reviewId);
  }

  // Método privado para actualizar el rating promedio del profesional
  async updateProfessionalRating(professionalId) {
    const prisma = require("../config/db");
    
    const stats = await this.repo.getReviewStats(professionalId);
    const avgRating = stats._avg.rating || 0;

    await prisma.professional.update({
      where: { id: professionalId },
      data: { avgRating }
    });
  }

  // Análisis de aspectos más valorados
  async getAspectAnalysis(professionalId) {
    const reviews = await this.repo.findByProfessionalId(professionalId);
    
    const aspects = {
      punctuality: 0,
      quality: 0,
      communication: 0,
      pricing: 0,
      cleanliness: 0,
      professionalism: 0
    };

    let totalWithAspects = 0;

    reviews.forEach(review => {
      if (review.aspectRatings) {
        totalWithAspects++;
        Object.keys(review.aspectRatings).forEach(aspect => {
          if (review.aspectRatings[aspect] && aspects.hasOwnProperty(aspect)) {
            aspects[aspect]++;
          }
        });
      }
    });

    // Convertir a porcentajes
    Object.keys(aspects).forEach(aspect => {
      aspects[aspect] = totalWithAspects > 0 ? (aspects[aspect] / totalWithAspects) * 100 : 0;
    });

    return {
      aspects,
      totalReviewsWithAspects: totalWithAspects
    };
  }

  // Obtener reseñas filtradas
  async getFilteredReviews(professionalId, filters = {}) {
    const { rating, recent, withAspects } = filters;
    
    let whereClause = { professionalId };
    
    if (rating) {
      whereClause.rating = rating;
    }

    if (recent) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      whereClause.createdAt = {
        gte: daysAgo
      };
    }

    if (withAspects) {
      whereClause.aspectRatings = {
        not: null
      };
    }

    const prisma = require("../config/db");
    return await prisma.review.findMany({
      where: whereClause,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

module.exports = new ReviewService();

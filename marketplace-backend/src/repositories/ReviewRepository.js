const prisma = require("../config/db");

class ReviewRepository {
  findAll() {
    return prisma.review.findMany({
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

  findById(id) {
    return prisma.review.findUnique({ 
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });
  }

  findByProfessionalId(professionalId) {
    return prisma.review.findMany({
      where: { professionalId },
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

  create(data) {
    return prisma.review.create({ 
      data,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });
  }

  update(id, data) {
    return prisma.review.update({ 
      where: { id }, 
      data,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });
  }

  delete(id) {
    return prisma.review.delete({ where: { id } });
  }

  // Nuevos métodos para estadísticas
  getReviewStats(professionalId) {
    return prisma.review.aggregate({
      where: { professionalId },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });
  }

  getRatingDistribution(professionalId) {
    return prisma.review.groupBy({
      by: ['rating'],
      where: { professionalId },
      _count: {
        rating: true
      },
      orderBy: {
        rating: 'desc'
      }
    });
  }

  getRecentReviews(professionalId, limit = 5) {
    return prisma.review.findMany({
      where: { professionalId },
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
      },
      take: limit
    });
  }

  incrementHelpful(id) {
    return prisma.review.update({
      where: { id },
      data: {
        helpful: {
          increment: 1
        }
      }
    });
  }
}

module.exports = new ReviewRepository();

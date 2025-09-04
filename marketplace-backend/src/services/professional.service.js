// src/services/professional.service.js
const BaseService = require("./base.service");
const professionalRepo = require("../repositories/ProfessionalRepository");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class ProfessionalService extends BaseService {
  constructor() {
    super(professionalRepo);
  }
  async findAll(filters) {
    const { order, page = 1, limit = 12, ...rest } = filters;
    
    // ―― 1) arma filtro combinado para Services (categoría / precio) ――
    const serviceConditions = [];
    if (filters.categoryId)
      serviceConditions.push({ categoryId: parseInt(filters.categoryId, 10) });
    if (filters.maxPrice)
      serviceConditions.push({ price: { lte: parseFloat(filters.maxPrice) } });

    const servicesWhere =
      serviceConditions.length === 0
        ? undefined
        : serviceConditions.length === 1
        ? serviceConditions[0]
        : { AND: serviceConditions };

    // ―― 2) consulta al repo con paginación ――
    const [pros, totalCount] = await Promise.all([
      professionalRepo.findAll(filters, servicesWhere),
      professionalRepo.countAll(filters)
    ]);

    // ―― 3) post‑procesa: promedio y objeto plano ――
    const flat = pros
      .map((p) => {
        const ratings = p.Reviews.map((r) => r.rating);

        const avgRating =
          ratings.length === 0
            ? null
            : ratings.reduce((a, b) => a + b, 0) / ratings.length;

        const cheapest = p.Services[0] || {};
        const category = cheapest.Category || {};

        return {
          id: p.id,
          name: p.User.name,
          lastName: p.User.lastName,
          email: p.User.email,
          phone: p.User.phone,
          city: p.location?.city || null,
          province: p.location?.province || null,
          location:
            p.location?.city +
              ", " +
              p.location?.province +
              ", " +
              p.location?.country || null,
          // servicio mínimo para síntesis en la tarjeta
          priceFrom: cheapest.price || null,
          categoryId: category.id || null,
          categoryName: category.name || null,
          categoryIcon: category.icon || null,

          // estadísticas
          avgRating,
          reviewsCount: ratings.length,

          experience: p.experience,

          // Subscription information
          subscriptionPlan: p.subscriptionPlan,
          isPriority: p.isPriority,
          isFeatured: p.isFeatured,
          isVerified: p.isVerified,

          // todas las reviews completas por si la UI las necesita
          reviews: p.Reviews.map((r) => ({
            rating: r.rating,
            comment: r.comment,
            user: r.User,
          })),
        };
      })
      .filter((p) =>
        filters.minRating
          ? (p.avgRating ?? 0) >= parseInt(filters.minRating, 10)
          : true
      );

    // El ordenamiento principal ya se aplicó en el repositorio (por suscripción)
    // Solo aplicamos ordenamiento secundario manteniendo la prioridad de suscripción
    switch (order) {
      case "rating_asc":
        flat.sort((a, b) => {
          // Primero por suscripción (featured > priority > free)
          const aSubscriptionPriority = a.isFeatured ? 3 : a.isPriority ? 2 : 1;
          const bSubscriptionPriority = b.isFeatured ? 3 : b.isPriority ? 2 : 1;
          
          if (aSubscriptionPriority !== bSubscriptionPriority) {
            return bSubscriptionPriority - aSubscriptionPriority; // descendente
          }
          // Luego por rating
          return (a.avgRating ?? 0) - (b.avgRating ?? 0);
        });
        break;
      case "rating_desc":
        flat.sort((a, b) => {
          // Primero por suscripción
          const aSubscriptionPriority = a.isFeatured ? 3 : a.isPriority ? 2 : 1;
          const bSubscriptionPriority = b.isFeatured ? 3 : b.isPriority ? 2 : 1;
          
          if (aSubscriptionPriority !== bSubscriptionPriority) {
            return bSubscriptionPriority - aSubscriptionPriority; // descendente
          }
          // Luego por rating
          return (b.avgRating ?? 0) - (a.avgRating ?? 0);
        });
        break;
      case "price_asc":
        flat.sort((a, b) => {
          // Primero por suscripción
          const aSubscriptionPriority = a.isFeatured ? 3 : a.isPriority ? 2 : 1;
          const bSubscriptionPriority = b.isFeatured ? 3 : b.isPriority ? 2 : 1;
          
          if (aSubscriptionPriority !== bSubscriptionPriority) {
            return bSubscriptionPriority - aSubscriptionPriority; // descendente
          }
          // Luego por precio
          return (a.priceFrom ?? 1e12) - (b.priceFrom ?? 1e12);
        });
        break;
      case "price_desc":
        flat.sort((a, b) => {
          // Primero por suscripción
          const aSubscriptionPriority = a.isFeatured ? 3 : a.isPriority ? 2 : 1;
          const bSubscriptionPriority = b.isFeatured ? 3 : b.isPriority ? 2 : 1;
          
          if (aSubscriptionPriority !== bSubscriptionPriority) {
            return bSubscriptionPriority - aSubscriptionPriority; // descendente
          }
          // Luego por precio
          return (b.priceFrom ?? 0) - (a.priceFrom ?? 0);
        });
        break;
      default:
        // Para orden por defecto, mantener el orden que viene del repositorio (ya ordenado por suscripción)
        break;
    }

    // ―― 4) calcular metadata de paginación ――
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const currentPage = parseInt(page);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      data: flat,
      pagination: {
        currentPage,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    };
  }

  async findById(id) {
    const p = await professionalRepo.findById(id);

    const ratings = p.Reviews.map((r) => r.rating);

    const avgRating =
      ratings.length === 0
        ? null
        : ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const cheapest = p.Services[0] || {};
    const category = cheapest.Category || {};

    return {
      id: p.id,
      name: p.User.name,
      lastName: p.User.lastName,
      phone: p.User.phone,
      email: p.User.email,
      description: p.description,
      city: p.location?.city || null,
      province: p.location?.province || null,
      location:
        p.location?.city +
          ", " +
          p.location?.province +
          ", " +
          p.location?.country || null,
      // servicio mínimo para síntesis en la tarjeta
      priceFrom: cheapest.price || null,
      categoryId: category.id || null,
      categoryName: category.name || null,
      categoryIcon: category.icon || null,

      // estadísticas
      avgRating,
      reviewsCount: ratings.length,

      experience: p.experience,

      services: p.Services.map((s) => ({
        title: s.title,
        description: s.description,
        price: s.price,
        category: s.Category,
      })),

      // todas las reviews completas por si la UI las necesita
      reviews: p.Reviews.map((r) => ({
        rating: r.rating,
        comment: r.comment,
        user: r.User,
      })),
    };
  }

  // Complete professional registration after user creation
  async completeRegistration(professionalData) {
    try {
      const {
        userId,
        description,
        experience,
        bio,
        priceFrom,
        city,
        province,
        postalCode,
        workingHours,
        emergencyService,
        supportsUrgent,
        insurance,
        languages,
        selectedPlan = 'free'
      } = professionalData;

      // First check if professional record already exists
      const existingProfessional = await prisma.professional.findUnique({
        where: { userId: parseInt(userId) }
      });

      if (existingProfessional) {
        const error = new Error('Professional profile already exists');
        error.status = 400;
        throw error;
      }

      // Create or find location
      let location = null;
      if (city && province) {
        // First try to find existing location
        location = await prisma.location.findFirst({
          where: {
            city,
            province
          }
        });

        // If not found, create new one
        if (!location) {
          location = await prisma.location.create({
            data: {
              city,
              province,
              postalCode: postalCode || "",
              country: "Argentina"
            }
          });
        }
      }

      // Get subscription plan details
      const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
        where: { id: selectedPlan }
      });

      if (!subscriptionPlan) {
        throw new Error('Invalid subscription plan selected');
      }

      // Create professional record
      const professional = await prisma.professional.create({
        data: {
          userId: parseInt(userId),
          description: description || "",
          experience: experience ? parseInt(experience) : null,
          bio: bio || "",
          priceFrom: priceFrom ? parseFloat(priceFrom) : null,
          avgRating: 0,
          completedJobs: 0,
          respondsQuickly: false,
          isVerified: false,
          supportsUrgent: Boolean(supportsUrgent),
          workingHours: workingHours || null,
          emergencyService: Boolean(emergencyService),
          insurance: insurance || null,
          responseTime: null,
          satisfactionRate: 0,
          languages: languages ? JSON.stringify(languages) : JSON.stringify(['Español']),
          locationId: location?.id || null,
          // Subscription fields
          subscriptionPlan: selectedPlan,
          subscriptionStatus: 'active',
          subscriptionExpiresAt: selectedPlan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          isPriority: subscriptionPlan.isPriority,
          isFeatured: subscriptionPlan.isFeatured,
          monthlyLeadLimit: subscriptionPlan.monthlyLeadLimit,
          monthlyLeadsUsed: 0,
          leadsResetDate: new Date()
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              lastName: true,
              email: true,
              phone: true,
              role: true
            }
          },
          location: true
        }
      });

      // Create subscription record if not free plan
      let paymentInfo = null;
      if (selectedPlan !== 'free') {
        const subscription = await prisma.subscription.create({
          data: {
            professionalId: professional.id,
            planId: selectedPlan,
            status: 'pending_payment', // Pending until payment is confirmed
            startDate: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            autoRenew: true
          }
        });

        // Set professional status as pending payment
        await prisma.professional.update({
          where: { id: professional.id },
          data: {
            subscriptionStatus: 'pending_payment',
            subscriptionExpiresAt: null, // No expiration until payment
            isPriority: false, // No benefits until payment
            isFeatured: false,
            monthlyLeadLimit: 5 // Default to free limits
          }
        });

        // Return payment information for frontend
        paymentInfo = {
          requiresPayment: true,
          planName: subscriptionPlan.name,
          amount: subscriptionPlan.price,
          planId: selectedPlan,
          professionalId: professional.id
        };
      }

      return {
        ...professional,
        paymentInfo
      };
    } catch (error) {
      console.error('Error in completeRegistration:', error);
      throw error;
    }
  }

  // Get professional dashboard data
  async getDashboardData(userId) {
    try {
      console.log('getDashboardData called with userId:', userId);
      // Get professional record by userId
      const professional = await prisma.professional.findUnique({
        where: { userId: parseInt(userId) },
        include: {
          User: {
            select: {
              name: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          Services: {
            include: {
              Category: true,
              Bookings: {
                orderBy: { createdAt: 'desc' },
                take: 5
              }
            }
          },
          Reviews: {
            include: {
              User: {
                select: { name: true, lastName: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          Portfolio: {
            orderBy: { createdAt: 'desc' },
            take: 6
          }
        }
      });

      if (!professional) {
        const error = new Error('Professional profile not found');
        error.status = 404;
        throw error;
      }

      // Get pending bookings/requests
      const pendingRequests = await prisma.booking.findMany({
        where: {
          Service: {
            professionalId: professional.id
          },
          status: 'pending'
        },
        include: {
          User: {
            select: { name: true, lastName: true, phone: true }
          },
          Service: {
            select: { title: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Calculate stats
      const totalServices = professional.Services.length;
      const totalReviews = professional.Reviews.length;
      const avgRating = totalReviews > 0 
        ? professional.Reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

      return {
        professional,
        stats: {
          totalServices,
          totalReviews,
          avgRating: Math.round(avgRating * 10) / 10,
          completedJobs: professional.completedJobs,
          pendingRequests: pendingRequests.length
        },
        pendingRequests,
        recentReviews: professional.Reviews.slice(0, 5)
      };
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      throw error;
    }
  }
}

module.exports = new ProfessionalService();

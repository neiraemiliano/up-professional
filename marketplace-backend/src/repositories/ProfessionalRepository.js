const prisma = require("../config/db");

class ProfessionalRepository {
  findAll(filters = {}, servicesWhere) {
    const { 
      categoryId, 
      locationId, 
      minRating, 
      maxPrice, 
      isVerified, 
      isUrgent, 
      respondsQuickly,
      order = 'rating_desc',
      page = 1,
      limit = 12,
      q // búsqueda por texto
    } = filters;

    /* ───────── 1) Construimos el filtro para Services ───────── */
    const serviceConditions = [];
    if (categoryId)
      serviceConditions.push({ categoryId: parseInt(categoryId, 10) });
    if (maxPrice)
      serviceConditions.push({ price: { lte: parseFloat(maxPrice) } });

    /* Si hay al menos una condición en Services, arma el objeto .some */
    const servicesFilter =
      serviceConditions.length > 0
        ? {
            Services: {
              some:
                serviceConditions.length === 1
                  ? serviceConditions[0] // solo una condición
                  : { AND: serviceConditions }, // categoría Y precio
            },
          }
        : {};

    /* ───────── 2) Filtro principal ───────── */
    
    // Construir ordenamiento - Primero por plan de suscripción, luego por criterio elegido
    let orderBy = [
      { isFeatured: 'desc' }, // Profesionales destacados (plan PRO) primero
      { isPriority: 'desc' },  // Profesionales prioritarios (premium/pro) segundo
    ];
    
    // Agregar criterio de ordenamiento específico
    switch (order) {
      case 'rating_desc':
        orderBy.push({ avgRating: 'desc' });
        break;
      case 'rating_asc':
        orderBy.push({ avgRating: 'asc' });
        break;
      case 'price_desc':
        orderBy.push({ priceFrom: 'desc' });
        break;
      case 'price_asc':
        orderBy.push({ priceFrom: 'asc' });
        break;
      default:
        orderBy.push({ avgRating: 'desc' });
    }
    
    // Agregar ordenamiento final por ID para consistencia
    orderBy.push({ id: 'desc' });
    
    // Calcular skip para paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir filtro de búsqueda por texto
    const searchFilter = q ? {
      OR: [
        {
          User: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } }
            ]
          }
        },
        { bio: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        {
          Specialties: {
            some: {
              Specialty: {
                name: { contains: q, mode: 'insensitive' }
              }
            }
          }
        }
      ]
    } : {};

    return prisma.professional.findMany({
      where: {
        /* Localidad */
        ...(locationId && { locationId: parseInt(locationId, 10) }),

        /* Categoría / precio (uno o ambos) */
        ...servicesFilter,

        /* Rating mínimo */
        ...(minRating && { avgRating: { gte: parseFloat(minRating) } }),

        /* Filtros adicionales */
        ...(isVerified && { isVerified: true }),
        ...(respondsQuickly && { respondsQuickly: true }),
        ...(isUrgent && { supportsUrgent: true }),

        /* Búsqueda por texto */
        ...searchFilter,
      },
      orderBy,
      skip,
      take: parseInt(limit),

      /* ───────── 3) Datos que devolvemos ───────── */
      // include: {
      //   User: true,
      //   location: true,
      //   Services: {
      //     where:
      //       serviceConditions.length > 0
      //         ? serviceConditions.length === 1
      //           ? serviceConditions[0]
      //           : { AND: serviceConditions }
      //         : undefined, // trae todos los servicios si no hay filtros
      //     include: { Category: true }, // 🔸 para exponer nombre/icono de la categoría
      //   },
      //   Reviews: true,
      //   _count: { select: { Reviews: true } },
      // },
      select: {
        id: true,
        experience: true,
        bio: true,
        priceFrom: true,
        avgRating: true,
        completedJobs: true,
        respondsQuickly: true,
        isVerified: true,
        supportsUrgent: true,
        workingHours: true,
        emergencyService: true,
        insurance: true,
        responseTime: true,
        satisfactionRate: true,
        languages: true,
        // Subscription fields
        subscriptionPlan: true,
        subscriptionStatus: true,
        isPriority: true,
        isFeatured: true,
        monthlyLeadLimit: true,
        User: { 
          select: { 
            name: true, 
            lastName: true, 
            phone: true, 
            avatarUrl: true 
          } 
        },
        location: { 
          select: { 
            city: true, 
            province: true, 
            country: true 
          } 
        },
        Services: {
          where: servicesWhere,
          select: {
            price: true,
            title: true,
            description: true,
            Category: { select: { id: true, name: true, icon: true } },
          },
          orderBy: { price: "asc" },
          take: 3, // Los 3 servicios más baratos
        },
        Reviews: {
          select: {
            rating: true,
            comment: true,
            service: true,
            createdAt: true,
            // datos mínimos del revisor
            User: {
              select: { id: true, name: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 3, // Solo las 3 más recientes
        },
        Certifications: {
          select: {
            name: true,
            type: true,
            isVerified: true,
          },
          where: { isVerified: true },
        },
        Specialties: {
          select: {
            yearsExperience: true,
            isMain: true,
            Specialty: {
              select: {
                name: true,
                icon: true,
                description: true,
              }
            }
          }
        },
        _count: { 
          select: { 
            Reviews: true,
            Services: true,
            Certifications: true
          } 
        },
      },
    });
  }

  // Método para contar total de profesionales (para paginación)
  async countAll(filters = {}) {
    const { 
      categoryId, 
      locationId, 
      minRating, 
      maxPrice, 
      isVerified, 
      isUrgent, 
      respondsQuickly,
      q
    } = filters;

    const serviceConditions = [];
    if (categoryId)
      serviceConditions.push({ categoryId: parseInt(categoryId, 10) });
    if (maxPrice)
      serviceConditions.push({ price: { lte: parseFloat(maxPrice) } });

    const servicesFilter =
      serviceConditions.length > 0
        ? {
            Services: {
              some:
                serviceConditions.length === 1
                  ? serviceConditions[0]
                  : { AND: serviceConditions },
            },
          }
        : {};

    const searchFilter = q ? {
      OR: [
        {
          User: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } }
            ]
          }
        },
        { bio: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        {
          Specialties: {
            some: {
              Specialty: {
                name: { contains: q, mode: 'insensitive' }
              }
            }
          }
        }
      ]
    } : {};

    return prisma.professional.count({
      where: {
        ...(locationId && { locationId: parseInt(locationId, 10) }),
        ...servicesFilter,
        ...(minRating && { avgRating: { gte: parseFloat(minRating) } }),
        ...(isVerified && { isVerified: true }),
        ...(respondsQuickly && { respondsQuickly: true }),
        ...(isUrgent && { supportsUrgent: true }),
        ...searchFilter,
      }
    });
  }

  findById(id) {
    return prisma.professional.findUnique({
      where: { id },
      select: {
        id: true,
        experience: true,
        description: true,
        bio: true,
        priceFrom: true,
        avgRating: true,
        completedJobs: true,
        respondsQuickly: true,
        isVerified: true,
        supportsUrgent: true,
        workingHours: true,
        emergencyService: true,
        insurance: true,
        responseTime: true,
        satisfactionRate: true,
        languages: true,
        User: {
          select: { 
            name: true, 
            lastName: true, 
            email: true, 
            phone: true,
            avatarUrl: true
          },
        },
        location: { 
          select: { 
            city: true, 
            province: true, 
            country: true 
          } 
        },
        Services: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            priceType: true,
            estimatedTime: true,
            includesMaterials: true,
            isUrgentAvailable: true,
            Category: { select: { id: true, name: true, icon: true } },
          },
        },
        Reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            aspectRatings: true,
            isAnonymous: true,
            wouldRecommend: true,
            serviceDate: true,
            helpful: true,
            service: true,
            createdAt: true,
            User: { 
              select: { 
                id: true, 
                name: true, 
                lastName: true,
                avatarUrl: true
              } 
            },
          },
          orderBy: { createdAt: 'desc' }
        },
        Certifications: {
          select: {
            name: true,
            type: true,
            issuer: true,
            issueDate: true,
            expiryDate: true,
            isVerified: true,
          },
        },
        Specialties: {
          select: {
            yearsExperience: true,
            isMain: true,
            Specialty: {
              select: {
                name: true,
                icon: true,
                description: true,
              }
            }
          }
        },
        Portfolio: {
          select: {
            id: true,
            url: true,
            title: true,
            description: true,
            orderIndex: true,
          },
          orderBy: { orderIndex: 'asc' }
        },
        _count: { 
          select: { 
            Reviews: true,
            Services: true,
            Certifications: true,
            Portfolio: true
          } 
        },
      },
    });
  }
  create(data) {
    return prisma.professional.create({ data });
  }
  update(id, data) {
    return prisma.professional.update({ where: { id }, data });
  }
  delete(id) {
    return prisma.professional.delete({ where: { id } });
  }
}

module.exports = new ProfessionalRepository();

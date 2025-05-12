// src/services/professional.service.js
const BaseService = require("./base.service");
const professionalRepo = require("../repositories/ProfessionalRepository");

class ProfessionalService extends BaseService {
  constructor() {
    super(professionalRepo);
  }
  async findAll(filters) {
    const { order, ...rest } = filters;
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

    // ―― 2) consulta al repo ――
    const pros = await professionalRepo.findAll(filters, servicesWhere);

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

    switch (order) {
      case "rating_asc":
        flat.sort((a, b) => (a.avgRating ?? 0) - (b.avgRating ?? 0));
        break;
      case "rating_desc":
        flat.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
        break;
      case "price_asc":
        flat.sort((a, b) => (a.priceFrom ?? 1e12) - (b.priceFrom ?? 1e12));
        break;
      case "price_desc":
        flat.sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0));
        break;
      default:
        break;
    }

    return flat;
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
}

module.exports = new ProfessionalService();

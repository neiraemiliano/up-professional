const prisma = require("../config/db");

class ProfessionalRepository {
  findAll(filters = {}, servicesWhere) {
    const { categoryId, locationId, minRating, maxPrice } = filters;

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
    return prisma.professional.findMany({
      where: {
        /* Localidad */
        ...(locationId && { locationId: parseInt(locationId, 10) }),

        /* Categoría / precio (uno o ambos) */
        ...servicesFilter,

        /* Rating mínimo */
        ...(minRating && {
          Reviews: {
            some: { rating: { gte: parseInt(minRating, 10) } },
          },
        }),
      },

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
        User: { select: { name: true, lastName: true, phone: true } },
        location: { select: { city: true, province: true, country: true } },
        Services: {
          where: servicesWhere,
          select: {
            price: true,
            Category: { select: { id: true, name: true, icon: true } },
          },
          orderBy: { price: "asc" },
          take: 1, // solo el más barato
        },
        Reviews: {
          select: {
            rating: true,
            comment: true,
            // datos mínimos del revisor
            User: {
              select: { id: true, name: true, lastName: true },
            },
          },
        },
      },
    });
  }

  findById(id) {
    return prisma.professional.findUnique({
      where: { id },
      select: {
        id: true,
        experience: true,
        description: true,
        User: {
          select: { name: true, lastName: true, email: true, phone: true },
        },
        location: { select: { city: true, province: true, country: true } },
        Services: {
          select: {
            price: true,
            description: true,
            Category: { select: { id: true, name: true, icon: true } },
          },
        },
        Reviews: {
          select: {
            rating: true,
            comment: true,
            User: { select: { id: true, name: true, lastName: true } },
          },
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

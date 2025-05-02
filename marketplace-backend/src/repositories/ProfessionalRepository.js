const prisma = require("../config/db");

class ProfessionalRepository {
  findAll() {
    return prisma.professional.findMany();
  }
  findById(id) {
    return prisma.professional.findUnique({ where: { id } });
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

const prisma = require("../config/db");

class ServiceRepository {
  findAll() {
    return prisma.service.findMany();
  }
  findById(id) {
    return prisma.service.findUnique({ where: { id } });
  }
  create(data) {
    return prisma.service.create({ data });
  }
  update(id, data) {
    return prisma.service.update({ where: { id }, data });
  }
  delete(id) {
    return prisma.service.delete({ where: { id } });
  }
}

module.exports = new ServiceRepository();

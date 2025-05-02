const prisma = require("../config/db");

class LocationRepository {
  findAll() {
    return prisma.location.findMany();
  }
  findById(id) {
    return prisma.location.findUnique({ where: { id } });
  }
  create(data) {
    return prisma.location.create({ data });
  }
  update(id, data) {
    return prisma.location.update({ where: { id }, data });
  }
  delete(id) {
    return prisma.location.delete({ where: { id } });
  }
}

module.exports = new LocationRepository();

const prisma = require("../config/db");

class BookingRepository {
  findAll() {
    return prisma.booking.findMany();
  }
  findById(id) {
    return prisma.booking.findUnique({ where: { id } });
  }
  create(data) {
    return prisma.booking.create({ data });
  }
  update(id, data) {
    return prisma.booking.update({ where: { id }, data });
  }
  delete(id) {
    return prisma.booking.delete({ where: { id } });
  }
}

module.exports = new BookingRepository();

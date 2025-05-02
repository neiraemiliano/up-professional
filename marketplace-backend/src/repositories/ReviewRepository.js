const prisma = require("../config/db");

class ReviewRepository {
  findAll() {
    return prisma.review.findMany();
  }
  findById(id) {
    return prisma.review.findUnique({ where: { id } });
  }
  create(data) {
    return prisma.review.create({ data });
  }
  update(id, data) {
    return prisma.review.update({ where: { id }, data });
  }
  delete(id) {
    return prisma.review.delete({ where: { id } });
  }
}

module.exports = new ReviewRepository();

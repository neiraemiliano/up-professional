const prisma = require("../config/db");

class UserRepository {
  findAll() {
    return prisma.user.findMany();
  }
  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }
  create(data) {
    return prisma.user.create({ data });
  }
  update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }
  delete(id) {
    return prisma.user.delete({ where: { id } });
  }
}

module.exports = new UserRepository();

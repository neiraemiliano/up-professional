// src/services/user.service.js
const BaseService = require("./base.service");
const userRepo = require("../repositories/UserRepository");

class UserService extends BaseService {
  constructor() {
    super(userRepo);
  }
  // Métodos específicos de User si los necesitas
}

module.exports = new UserService();

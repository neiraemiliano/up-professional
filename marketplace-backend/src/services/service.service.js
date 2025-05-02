// src/services/service.service.js
const BaseService = require("./base.service");
const serviceRepo = require("../repositories/ServiceRepository");

class ServiceService extends BaseService {
  constructor() {
    super(serviceRepo);
  }
  // Métodos específicos de Service
}

module.exports = new ServiceService();

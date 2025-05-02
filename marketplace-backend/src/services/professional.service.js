// src/services/professional.service.js
const BaseService = require("./base.service");
const professionalRepo = require("../repositories/ProfessionalRepository");

class ProfessionalService extends BaseService {
  constructor() {
    super(professionalRepo);
  }
  // Métodos específicos de Professional
}

module.exports = new ProfessionalService();

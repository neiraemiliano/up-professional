// src/services/location.service.js
const BaseService = require("./base.service");
const locationRepo = require("../repositories/LocationRepository");

class LocationService extends BaseService {
  constructor() {
    super(locationRepo);
  }
  // Métodos específicos de Location
}

module.exports = new LocationService();

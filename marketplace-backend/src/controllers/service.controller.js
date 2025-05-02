// src/controllers/service.controller.js
const generateController = require("./base.controller");
const serviceService = require("../services/service.service");
module.exports = generateController(serviceService);

// src/controllers/professional.controller.js
const generateController = require("./base.controller");
const professionalService = require("../services/professional.service");
module.exports = generateController(professionalService);

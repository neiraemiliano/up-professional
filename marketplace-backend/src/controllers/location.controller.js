// src/controllers/location.controller.js
const generateController = require("./base.controller");
const locationService = require("../services/location.service");
module.exports = generateController(locationService);

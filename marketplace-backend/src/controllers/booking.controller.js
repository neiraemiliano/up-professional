// src/controllers/booking.controller.js
const generateController = require("./base.controller");
const bookingService = require("../services/booking.service");
module.exports = generateController(bookingService);

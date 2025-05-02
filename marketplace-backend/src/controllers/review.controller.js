// src/controllers/review.controller.js
const generateController = require("./base.controller");
const reviewService = require("../services/review.service");
module.exports = generateController(reviewService);

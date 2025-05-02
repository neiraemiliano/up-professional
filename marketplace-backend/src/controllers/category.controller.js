// src/controllers/category.controller.js
const generateController = require("./base.controller");
const categoryService = require("../services/category.service");
module.exports = generateController(categoryService);

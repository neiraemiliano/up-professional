// src/controllers/user.controller.js
const generateController = require("./base.controller");
const userService = require("../services/user.service");
module.exports = generateController(userService);

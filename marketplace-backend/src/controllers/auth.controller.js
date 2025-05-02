// src/controllers/auth.controller.js

const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    console.log("🚀 ~ login ~ err:", err);
    next(err);
  }
}

module.exports = { register, login };

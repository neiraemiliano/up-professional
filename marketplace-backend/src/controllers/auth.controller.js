// src/controllers/auth.controller.js

const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: "Registro exitoso"
    });
  } catch (err) {
    console.log("🚀 ~ register ~ err:", err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Error de registro",
      message: err.message || "Error de registro"
    });
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      data: result,
      message: "Login exitoso"
    });
  } catch (err) {
    console.log("🚀 ~ login ~ err:", err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Error de autenticación",
      message: err.message || "Error de autenticación"
    });
  }
}

module.exports = { register, login };

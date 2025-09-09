// src/controllers/auth.controller.js

const authService = require("../services/auth.service");
const analyticsService = require("../services/analytics.service");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    
    // Track user registration event
    analyticsService.trackUserRegistration(
      result.user.id, 
      result.user.role,
      {
        source: req.get("Referrer") || 'direct',
        userAgent: req.get("User-Agent")
      }
    ).catch(err => console.error("Analytics tracking error:", err));

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

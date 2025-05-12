// ================================
// src/routes/auth.routes.js
// ================================
const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const { validateBody } = require("../middlewares/validate");
const Joi = require("joi");

// DTOs inline for auth
const registerSchema = Joi.object({
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("customer", "professional", "admin").required(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

module.exports = router;

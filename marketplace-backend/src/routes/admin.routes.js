// src/routes/admin.routes.js
const router = require("express").Router();
const { getAllUsers, updateUser } = require("../controllers/user.controller");

// Estas dos rutas solo para admins
router
  .get("/users", getAllUsers) // ver todos los usuarios
  .put("/users/:id/role", updateUser); // cambiar el role de un usuario

module.exports = router;

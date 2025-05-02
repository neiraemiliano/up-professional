// src/routes/user.routes.js
const router = require("express").Router();
const userController = require("../controllers/user.controller");

router
  .get("/", userController.getAll)
  .get("/:id", userController.getById)
  .post("/", userController.create)
  .put("/:id", userController.update)
  .delete("/:id", userController.delete);

module.exports = router;

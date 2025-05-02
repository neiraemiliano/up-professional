// src/routes/category.routes.js
const router = require("express").Router();
const categoryController = require("../controllers/category.controller");

router
  .get("/", categoryController.getAll)
  .get("/:id", categoryController.getById)
  .post("/", categoryController.create)
  .put("/:id", categoryController.update)
  .delete("/:id", categoryController.delete);

module.exports = router;

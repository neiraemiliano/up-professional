// src/routes/service.routes.js
const router = require("express").Router();
const serviceController = require("../controllers/service.controller");

router
  .get("/", serviceController.getAll)
  .get("/:id", serviceController.getById)
  .post("/", serviceController.create)
  .put("/:id", serviceController.update)
  .delete("/:id", serviceController.delete);

module.exports = router;

// src/routes/professional.routes.js
const router = require("express").Router();
const professionalController = require("../controllers/professional.controller");

router
  .get("/", professionalController.getAll)
  .get("/:id", professionalController.getById)
  .post("/", professionalController.create)
  .put("/:id", professionalController.update)
  .delete("/:id", professionalController.delete);

module.exports = router;

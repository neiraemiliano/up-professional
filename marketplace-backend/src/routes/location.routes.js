// src/routes/location.routes.js
const router = require("express").Router();
const locationController = require("../controllers/location.controller");

router
  .get("/", locationController.getAll)
  .get("/:id", locationController.getById)
  .post("/", locationController.create)
  .put("/:id", locationController.update)
  .delete("/:id", locationController.delete);

module.exports = router;

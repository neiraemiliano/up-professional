// src/routes/review.routes.js
const router = require("express").Router();
const reviewController = require("../controllers/review.controller");

router
  .get("/", reviewController.getAll)
  .get("/:id", reviewController.getById)
  .post("/", reviewController.create)
  .put("/:id", reviewController.update)
  .delete("/:id", reviewController.delete);

module.exports = router;

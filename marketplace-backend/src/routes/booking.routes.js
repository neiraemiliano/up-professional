// src/routes/booking.routes.js
const router = require("express").Router();
const bookingController = require("../controllers/booking.controller");

router
  .get("/", bookingController.getAll)
  .get("/:id", bookingController.getById)
  .post("/", bookingController.create)
  .put("/:id", bookingController.update)
  .delete("/:id", bookingController.delete);

module.exports = router;

// src/routes/booking.routes.js
const router = require("express").Router();
const bookingController = require("../controllers/booking.controller");
const { authMiddleware } = require("../middlewares/auth");

// All booking operations require authentication
router
  .get("/", authMiddleware, bookingController.getAll)
  .get("/:id", authMiddleware, bookingController.getById)
  .post("/", authMiddleware, bookingController.create)
  .put("/:id", authMiddleware, bookingController.update)
  .delete("/:id", authMiddleware, bookingController.delete);

module.exports = router;

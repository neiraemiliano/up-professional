// src/index.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// Rutas
const userRoutes = require("./routes/user.routes");
const professionalRoutes = require("./routes/professional.routes");
const categoryRoutes = require("./routes/category.routes");
const serviceRoutes = require("./routes/service.routes");
const bookingRoutes = require("./routes/booking.routes");
const reviewRoutes = require("./routes/review.routes");
const locationRoutes = require("./routes/location.routes");
const authRoutes = require("./routes/auth.routes");
const urgentRoutes = require("./routes/urgent.routes");
const portfolioRoutes = require("./routes/portfolio.routes");
const searchRoutes = require("./routes/search.routes");
const intelligentSearchRoutes = require("./routes/intelligentSearch.routes");
const availabilityRoutes = require("./routes/availability.routes");
const verificationRoutes = require("./routes/verification.routes");
const adminRoutes = require("./routes/admin.routes");
const paymentRoutes = require("./routes/payment.routes");
const featureFlagRoutes = require("./routes/featureFlag.routes");
const contentRoutes = require("./routes/content.routes");
// Middlewares
const { authMiddleware, requireRole } = require("./middlewares/auth");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Montaje de rutas bajo /api
app.use("/api/auth", authRoutes);
app.use("/api/admin", authMiddleware, requireRole("admin"), adminRoutes);
app.use("/api/users", userRoutes);
// app.use(
//   "/api/professionals",
//   authMiddleware,
//   requireRole("professional"),
//   professionalRoutes
// );
app.use("/api/professionals", professionalRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/urgent", urgentRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/intelligent-search", intelligentSearchRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/feature-flags", featureFlagRoutes);
app.use("/api", contentRoutes);

app.get("/api/health", async (req, res) => {
  try {
    res
      .status(200)
      .json({ ok: true, service: "backend", time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: "health_failed" });
  }
});

// Middleware para rutas no definidas
app.use(notFound);

// Manejador de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

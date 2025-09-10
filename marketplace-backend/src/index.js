// src/index.js
// Load environment configuration based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require("dotenv").config({ path: envFile });
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
const analyticsRoutes = require("./routes/analytics.routes");
// Middlewares
const { authMiddleware, requireRole } = require("./middlewares/auth");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Middlewares globales
// Secure CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      process.env.FRONTEND_PROD_URL || 'https://yourdomain.com',
      'http://localhost:3000', // Development frontend
      'http://localhost:3001', // Alternative dev port
      'https://mp-prod-domain.com' // MercadoPago production domain
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 200, // Support legacy browsers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-signature', 'x-request-id']
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' })); // Prevent large payload attacks

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
// Analytics routes - event tracking is public, dashboard is admin-protected
app.use("/api/analytics", analyticsRoutes);

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

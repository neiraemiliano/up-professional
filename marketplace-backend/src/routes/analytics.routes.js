const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { authMiddleware, requireRole } = require("../middlewares/auth");

// Public event tracking endpoint (no auth required)
router.post("/events", analyticsController.trackEvent);

// Protected analytics dashboard endpoints (admin only)
router.use(authMiddleware, requireRole("admin"));

// Analytics dashboard data
router.get("/dashboard", analyticsController.getDashboardAnalytics);
router.get("/dashboard/realtime", analyticsController.getRealtimeAnalytics);

// User analytics
router.get("/users", analyticsController.getUserAnalytics);
router.get("/users/activity", analyticsController.getUserActivityAnalytics);
router.get("/users/retention", analyticsController.getUserRetentionAnalytics);

// Professional analytics
router.get("/professionals", analyticsController.getProfessionalAnalytics);
router.get("/professionals/performance", analyticsController.getProfessionalPerformanceAnalytics);

// Search analytics
router.get("/search", analyticsController.getSearchAnalytics);
router.get("/search/terms", analyticsController.getTopSearchTerms);
router.get("/search/conversion", analyticsController.getSearchConversionAnalytics);

// Booking analytics
router.get("/bookings", analyticsController.getBookingAnalytics);
router.get("/bookings/conversion", analyticsController.getBookingConversionAnalytics);

// Revenue analytics
router.get("/revenue", analyticsController.getRevenueAnalytics);
router.get("/revenue/trends", analyticsController.getRevenueTrends);

// Event retrieval and export (admin only)
router.get("/events", analyticsController.getEvents);
router.get("/export/:type", analyticsController.exportAnalytics);

module.exports = router;
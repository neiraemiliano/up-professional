const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const analyticsController = {
  // Track an analytics event
  async trackEvent(req, res) {
    try {
      const {
        eventType,
        category,
        action,
        label,
        value,
        userId,
        professionalId,
        bookingId,
        sessionId,
        metadata = {}
      } = req.body;

      // Get IP and User Agent from request
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");
      const referrer = req.get("Referrer");

      const event = await prisma.analyticsEvent.create({
        data: {
          eventType,
          category,
          action,
          label,
          value: value ? parseFloat(value) : null,
          userId: userId ? parseInt(userId) : null,
          professionalId: professionalId ? parseInt(professionalId) : null,
          bookingId: bookingId ? parseInt(bookingId) : null,
          sessionId,
          ipAddress,
          userAgent,
          referrer,
          metadata
        }
      });

      // Update daily aggregated data
      await updateDailyAnalytics(event);

      res.json({ success: true, eventId: event.id });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Error tracking event" });
    }
  },

  // Get dashboard analytics overview
  async getDashboardAnalytics(req, res) {
    try {
      const { period = "30d", startDate, endDate } = req.query;
      const dateRange = getDateRange(period, startDate, endDate);

      // Get aggregated dashboard data
      const dashboardData = await prisma.analyticsDashboard.findMany({
        where: {
          date: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        },
        orderBy: { date: 'asc' }
      });

      // Calculate totals and trends
      const currentPeriodTotals = dashboardData.reduce((acc, day) => ({
        totalUsers: Math.max(acc.totalUsers, day.totalUsers),
        totalProfessionals: Math.max(acc.totalProfessionals, day.totalProfessionals),
        totalBookings: Math.max(acc.totalBookings, day.totalBookings),
        totalRevenue: Math.max(acc.totalRevenue, day.totalRevenue),
        newUsers: acc.newUsers + day.newUsers,
        newProfessionals: acc.newProfessionals + day.newProfessionals,
        newBookings: acc.newBookings + day.newBookings,
        newRevenue: acc.newRevenue + day.newRevenue,
        searchQueries: acc.searchQueries + day.searchQueries,
        professionalContacts: acc.professionalContacts + day.professionalContacts
      }), {
        totalUsers: 0, totalProfessionals: 0, totalBookings: 0, totalRevenue: 0,
        newUsers: 0, newProfessionals: 0, newBookings: 0, newRevenue: 0,
        searchQueries: 0, professionalContacts: 0
      });

      // Get previous period for comparison
      const previousDateRange = getPreviousPeriodRange(period, startDate, endDate);
      const previousPeriodData = await prisma.analyticsDashboard.findMany({
        where: {
          date: {
            gte: previousDateRange.startDate,
            lte: previousDateRange.endDate
          }
        }
      });

      const previousPeriodTotals = previousPeriodData.reduce((acc, day) => ({
        newUsers: acc.newUsers + day.newUsers,
        newProfessionals: acc.newProfessionals + day.newProfessionals,
        newBookings: acc.newBookings + day.newBookings,
        newRevenue: acc.newRevenue + day.newRevenue
      }), { newUsers: 0, newProfessionals: 0, newBookings: 0, newRevenue: 0 });

      // Calculate trends
      const trends = {
        usersGrowth: calculateGrowthPercentage(currentPeriodTotals.newUsers, previousPeriodTotals.newUsers),
        professionalsGrowth: calculateGrowthPercentage(currentPeriodTotals.newProfessionals, previousPeriodTotals.newProfessionals),
        bookingsGrowth: calculateGrowthPercentage(currentPeriodTotals.newBookings, previousPeriodTotals.newBookings),
        revenueGrowth: calculateGrowthPercentage(currentPeriodTotals.newRevenue, previousPeriodTotals.newRevenue)
      };

      // Get chart data
      const chartData = dashboardData.map(day => ({
        date: day.date.toISOString().split('T')[0],
        newUsers: day.newUsers,
        newProfessionals: day.newProfessionals,
        newBookings: day.newBookings,
        revenue: day.newRevenue,
        searchQueries: day.searchQueries,
        professionalContacts: day.professionalContacts
      }));

      // Get top performing data
      const latestData = dashboardData[dashboardData.length - 1];
      const topSearchTerms = latestData?.topSearchTerms || [];
      const topCategories = latestData?.topCategories || [];

      res.json({
        overview: currentPeriodTotals,
        trends,
        chartData,
        topSearchTerms,
        topCategories,
        period,
        dateRange: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString()
        }
      });
    } catch (error) {
      console.error("Error getting dashboard analytics:", error);
      res.status(500).json({ error: "Error fetching dashboard analytics" });
    }
  },

  // Get real-time analytics
  async getRealtimeAnalytics(req, res) {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get recent events
      const recentEvents = await prisma.analyticsEvent.findMany({
        where: {
          timestamp: {
            gte: last24Hours
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 100
      });

      // Calculate real-time metrics
      const metrics = {
        activeUsers: new Set(recentEvents.filter(e => e.userId).map(e => e.userId)).size,
        pageViews: recentEvents.filter(e => e.action === 'view').length,
        searches: recentEvents.filter(e => e.eventType === 'search').length,
        contacts: recentEvents.filter(e => e.eventType === 'professional_contact').length,
        bookings: recentEvents.filter(e => e.eventType === 'booking_created').length
      };

      // Group events by hour for chart
      const hourlyData = {};
      recentEvents.forEach(event => {
        const hour = new Date(event.timestamp).getHours();
        if (!hourlyData[hour]) hourlyData[hour] = 0;
        hourlyData[hour]++;
      });

      const chartData = Array.from({length: 24}, (_, i) => ({
        hour: i,
        events: hourlyData[i] || 0
      }));

      res.json({
        metrics,
        chartData,
        lastUpdated: now.toISOString()
      });
    } catch (error) {
      console.error("Error getting realtime analytics:", error);
      res.status(500).json({ error: "Error fetching realtime analytics" });
    }
  },

  // Get user analytics
  async getUserAnalytics(req, res) {
    try {
      const { period = "30d", startDate, endDate } = req.query;
      const dateRange = getDateRange(period, startDate, endDate);

      // Get user registration trends
      const userTrends = await prisma.analyticsEvent.groupBy({
        by: ['timestamp'],
        where: {
          eventType: 'user_registration',
          timestamp: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        },
        _count: {
          id: true
        }
      });

      // Get user activity data
      const userActivity = await prisma.analyticsUserActivity.findMany({
        where: {
          date: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        },
        include: {
          User: {
            select: {
              name: true,
              email: true,
              role: true,
              createdAt: true
            }
          }
        }
      });

      // Calculate user engagement metrics
      const engagementMetrics = userActivity.reduce((acc, activity) => ({
        totalSessions: acc.totalSessions + (activity.pageViews > 0 ? 1 : 0),
        totalPageViews: acc.totalPageViews + activity.pageViews,
        totalSearches: acc.totalSearches + activity.searches,
        totalContacts: acc.totalContacts + activity.professionalsContacted,
        totalSessionDuration: acc.totalSessionDuration + activity.sessionDuration
      }), {
        totalSessions: 0,
        totalPageViews: 0,
        totalSearches: 0,
        totalContacts: 0,
        totalSessionDuration: 0
      });

      res.json({
        registrationTrends: userTrends,
        activityData: userActivity,
        engagementMetrics,
        avgSessionDuration: engagementMetrics.totalSessions > 0 
          ? engagementMetrics.totalSessionDuration / engagementMetrics.totalSessions 
          : 0
      });
    } catch (error) {
      console.error("Error getting user analytics:", error);
      res.status(500).json({ error: "Error fetching user analytics" });
    }
  },

  // Get search analytics
  async getSearchAnalytics(req, res) {
    try {
      const { period = "30d", startDate, endDate } = req.query;
      const dateRange = getDateRange(period, startDate, endDate);

      const searchMetrics = await prisma.analyticsSearchMetrics.findMany({
        where: {
          date: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        },
        orderBy: {
          clickThrough: 'desc'
        }
      });

      // Aggregate search data
      const totalSearches = searchMetrics.reduce((sum, metric) => sum + metric.clickThrough, 0);
      const totalConversions = searchMetrics.reduce((sum, metric) => sum + metric.conversions, 0);
      const avgConversionRate = totalSearches > 0 ? (totalConversions / totalSearches) * 100 : 0;

      // Get top search terms
      const topTerms = searchMetrics
        .sort((a, b) => b.clickThrough - a.clickThrough)
        .slice(0, 20)
        .map(metric => ({
          term: metric.searchTerm,
          searches: metric.clickThrough,
          conversions: metric.conversions,
          conversionRate: metric.clickThrough > 0 ? (metric.conversions / metric.clickThrough) * 100 : 0
        }));

      res.json({
        totalSearches,
        totalConversions,
        conversionRate: avgConversionRate,
        topSearchTerms: topTerms,
        searchTrends: searchMetrics
      });
    } catch (error) {
      console.error("Error getting search analytics:", error);
      res.status(500).json({ error: "Error fetching search analytics" });
    }
  },

  // Get booking analytics
  async getBookingAnalytics(req, res) {
    try {
      const { period = "30d", startDate, endDate } = req.query;
      const dateRange = getDateRange(period, startDate, endDate);

      // Get booking creation events
      const bookingEvents = await prisma.analyticsEvent.findMany({
        where: {
          eventType: 'booking_created',
          timestamp: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        },
        include: {
          bookingId: true
        }
      });

      // Get actual booking data for value analysis
      const bookingIds = bookingEvents.map(e => e.bookingId).filter(Boolean);
      const bookings = await prisma.booking.findMany({
        where: {
          id: { in: bookingIds }
        },
        include: {
          Service: {
            include: {
              Category: true
            }
          }
        }
      });

      // Calculate booking metrics
      const bookingsByStatus = await prisma.booking.groupBy({
        by: ['status'],
        where: {
          createdAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        },
        _count: {
          id: true
        }
      });

      const avgBookingValue = bookings.length > 0 
        ? bookings.reduce((sum, booking) => sum + (booking.estimatedPrice || 0), 0) / bookings.length
        : 0;

      // Category performance
      const categoryPerformance = {};
      bookings.forEach(booking => {
        const categoryName = booking.Service?.Category?.name || 'Unknown';
        if (!categoryPerformance[categoryName]) {
          categoryPerformance[categoryName] = { count: 0, totalValue: 0 };
        }
        categoryPerformance[categoryName].count++;
        categoryPerformance[categoryName].totalValue += booking.estimatedPrice || 0;
      });

      res.json({
        totalBookings: bookings.length,
        avgBookingValue,
        bookingsByStatus,
        categoryPerformance,
        bookingTrends: bookingEvents.map(event => ({
          date: event.timestamp,
          value: event.value || 0
        }))
      });
    } catch (error) {
      console.error("Error getting booking analytics:", error);
      res.status(500).json({ error: "Error fetching booking analytics" });
    }
  },

  // Get revenue analytics
  async getRevenueAnalytics(req, res) {
    try {
      const { period = "30d", startDate, endDate } = req.query;
      const dateRange = getDateRange(period, startDate, endDate);

      // Get payment data
      const payments = await prisma.servicePayment.findMany({
        where: {
          createdAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          },
          status: 'paid'
        }
      });

      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalCommissions = payments.reduce((sum, payment) => sum + payment.platformFee, 0);

      // Revenue by day
      const revenueByDay = {};
      payments.forEach(payment => {
        const day = payment.createdAt.toISOString().split('T')[0];
        if (!revenueByDay[day]) revenueByDay[day] = 0;
        revenueByDay[day] += payment.amount;
      });

      const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue
      }));

      res.json({
        totalRevenue,
        totalCommissions,
        avgTransactionValue: payments.length > 0 ? totalRevenue / payments.length : 0,
        chartData
      });
    } catch (error) {
      console.error("Error getting revenue analytics:", error);
      res.status(500).json({ error: "Error fetching revenue analytics" });
    }
  },

  // Export analytics data
  async exportAnalytics(req, res) {
    try {
      const { type } = req.params;
      const { period = "30d", format = "json" } = req.query;
      
      // Implementation would depend on export requirements
      res.json({ 
        message: `Exporting ${type} analytics in ${format} format`,
        type,
        period,
        format 
      });
    } catch (error) {
      console.error("Error exporting analytics:", error);
      res.status(500).json({ error: "Error exporting analytics" });
    }
  },

  // Additional methods for other endpoints...
  async getProfessionalAnalytics(req, res) {
    res.json({ message: "Professional analytics endpoint" });
  },

  async getTopSearchTerms(req, res) {
    res.json({ message: "Top search terms endpoint" });
  },

  async getEvents(req, res) {
    res.json({ message: "Events endpoint" });
  },

  async getUserActivityAnalytics(req, res) {
    res.json({ message: "User activity analytics endpoint" });
  },

  async getUserRetentionAnalytics(req, res) {
    res.json({ message: "User retention analytics endpoint" });
  },

  async getProfessionalPerformanceAnalytics(req, res) {
    res.json({ message: "Professional performance analytics endpoint" });
  },

  async getSearchConversionAnalytics(req, res) {
    res.json({ message: "Search conversion analytics endpoint" });
  },

  async getBookingConversionAnalytics(req, res) {
    res.json({ message: "Booking conversion analytics endpoint" });
  },

  async getRevenueTrends(req, res) {
    res.json({ message: "Revenue trends endpoint" });
  }
};

// Helper functions
function getDateRange(period, startDate, endDate) {
  const now = new Date();
  
  if (startDate && endDate) {
    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    };
  }

  let days;
  switch (period) {
    case '7d': days = 7; break;
    case '30d': days = 30; break;
    case '90d': days = 90; break;
    case '1y': days = 365; break;
    default: days = 30;
  }

  return {
    startDate: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
    endDate: now
  };
}

function getPreviousPeriodRange(period, startDate, endDate) {
  const currentRange = getDateRange(period, startDate, endDate);
  const duration = currentRange.endDate.getTime() - currentRange.startDate.getTime();
  
  return {
    startDate: new Date(currentRange.startDate.getTime() - duration),
    endDate: new Date(currentRange.endDate.getTime() - duration)
  };
}

function calculateGrowthPercentage(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

async function updateDailyAnalytics(event) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's analytics record
    let dailyRecord = await prisma.analyticsDashboard.findUnique({
      where: { date: today }
    });

    if (!dailyRecord) {
      // Get current totals for the record
      const [userCount, professionalCount, bookingCount] = await Promise.all([
        prisma.user.count(),
        prisma.professional.count(),
        prisma.booking.count()
      ]);

      const revenueSum = await prisma.servicePayment.aggregate({
        _sum: { amount: true },
        where: { status: 'paid' }
      });

      dailyRecord = await prisma.analyticsDashboard.create({
        data: {
          date: today,
          totalUsers: userCount,
          totalProfessionals: professionalCount,
          totalBookings: bookingCount,
          totalRevenue: revenueSum._sum.amount || 0
        }
      });
    }

    // Update counters based on event type
    const updates = {};
    switch (event.eventType) {
      case 'user_registration':
        updates.userRegistrations = { increment: 1 };
        if (event.metadata?.role === 'professional') {
          updates.professionalRegistrations = { increment: 1 };
        }
        break;
      case 'search':
        updates.searchQueries = { increment: 1 };
        break;
      case 'professional_contact':
        updates.professionalContacts = { increment: 1 };
        break;
      case 'booking_created':
        updates.newBookings = { increment: 1 };
        break;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.analyticsDashboard.update({
        where: { date: today },
        data: updates
      });
    }
  } catch (error) {
    console.error("Error updating daily analytics:", error);
  }
}

module.exports = analyticsController;
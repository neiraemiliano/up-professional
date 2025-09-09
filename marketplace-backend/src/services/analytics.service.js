const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AnalyticsService {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.batchSize = 50;
    this.flushInterval = 5000; // 5 seconds

    // Start batch processing
    this.startBatchProcessor();
  }

  /**
   * Track an analytics event
   * @param {Object} eventData - The event data to track
   */
  async track(eventData) {
    try {
      // Add timestamp if not provided
      if (!eventData.timestamp) {
        eventData.timestamp = new Date();
      }

      // Add to queue for batch processing
      this.queue.push(eventData);

      // If queue is full, process immediately
      if (this.queue.length >= this.batchSize) {
        await this.processBatch();
      }

      return { success: true };
    } catch (error) {
      console.error("Error adding event to queue:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Track user registration
   */
  async trackUserRegistration(userId, userRole, metadata = {}) {
    return this.track({
      eventType: 'user_registration',
      category: 'user',
      action: 'create',
      userId,
      metadata: {
        role: userRole,
        ...metadata
      }
    });
  }

  /**
   * Track search event
   */
  async trackSearch(searchTerm, category, resultCount, userId, sessionId, metadata = {}) {
    return this.track({
      eventType: 'search',
      category: 'search',
      action: 'search',
      label: searchTerm,
      value: resultCount,
      userId,
      sessionId,
      metadata: {
        searchTerm,
        category,
        resultCount,
        ...metadata
      }
    });
  }

  /**
   * Track professional contact
   */
  async trackProfessionalContact(userId, professionalId, contactMethod, sessionId, metadata = {}) {
    return this.track({
      eventType: 'professional_contact',
      category: 'professional',
      action: 'contact',
      label: contactMethod,
      userId,
      professionalId,
      sessionId,
      metadata: {
        contactMethod,
        ...metadata
      }
    });
  }

  /**
   * Track booking creation
   */
  async trackBookingCreation(userId, professionalId, bookingId, bookingValue, sessionId, metadata = {}) {
    return this.track({
      eventType: 'booking_created',
      category: 'booking',
      action: 'create',
      value: bookingValue,
      userId,
      professionalId,
      bookingId,
      sessionId,
      metadata
    });
  }

  /**
   * Track page view
   */
  async trackPageView(userId, pagePath, sessionId, metadata = {}) {
    return this.track({
      eventType: 'page_view',
      category: 'navigation',
      action: 'view',
      label: pagePath,
      userId,
      sessionId,
      metadata: {
        pagePath,
        ...metadata
      }
    });
  }

  /**
   * Track professional profile view
   */
  async trackProfessionalView(userId, professionalId, sessionId, metadata = {}) {
    return this.track({
      eventType: 'professional_view',
      category: 'professional',
      action: 'view',
      userId,
      professionalId,
      sessionId,
      metadata
    });
  }

  /**
   * Track service inquiry
   */
  async trackServiceInquiry(userId, professionalId, serviceId, sessionId, metadata = {}) {
    return this.track({
      eventType: 'service_inquiry',
      category: 'service',
      action: 'inquiry',
      userId,
      professionalId,
      sessionId,
      metadata: {
        serviceId,
        ...metadata
      }
    });
  }

  /**
   * Track payment event
   */
  async trackPayment(userId, professionalId, paymentAmount, paymentStatus, sessionId, metadata = {}) {
    return this.track({
      eventType: 'payment',
      category: 'payment',
      action: paymentStatus, // 'initiated', 'completed', 'failed'
      value: paymentAmount,
      userId,
      professionalId,
      sessionId,
      metadata
    });
  }

  /**
   * Track review submission
   */
  async trackReviewSubmission(userId, professionalId, rating, sessionId, metadata = {}) {
    return this.track({
      eventType: 'review_submitted',
      category: 'review',
      action: 'create',
      value: rating,
      userId,
      professionalId,
      sessionId,
      metadata
    });
  }

  /**
   * Track user activity for daily aggregation
   */
  async trackUserActivity(userId, activityType, sessionDuration = 0) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get or create user activity record for today
      let userActivity = await prisma.analyticsUserActivity.findUnique({
        where: {
          userId_date: {
            userId,
            date: today
          }
        }
      });

      const updates = { lastActivity: new Date() };

      switch (activityType) {
        case 'page_view':
          updates.pageViews = { increment: 1 };
          break;
        case 'search':
          updates.searches = { increment: 1 };
          break;
        case 'booking_created':
          updates.bookingsCreated = { increment: 1 };
          break;
        case 'professional_contact':
          updates.professionalsContacted = { increment: 1 };
          break;
        case 'session_duration':
          updates.sessionDuration = { increment: sessionDuration };
          break;
      }

      if (userActivity) {
        await prisma.analyticsUserActivity.update({
          where: {
            userId_date: {
              userId,
              date: today
            }
          },
          data: updates
        });
      } else {
        await prisma.analyticsUserActivity.create({
          data: {
            userId,
            date: today,
            pageViews: activityType === 'page_view' ? 1 : 0,
            searches: activityType === 'search' ? 1 : 0,
            bookingsCreated: activityType === 'booking_created' ? 1 : 0,
            professionalsContacted: activityType === 'professional_contact' ? 1 : 0,
            sessionDuration: sessionDuration,
            lastActivity: new Date()
          }
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error tracking user activity:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Track search metrics for conversion analysis
   */
  async trackSearchMetrics(searchTerm, category, resultCount, clicked = false, converted = false) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get or create search metrics record
      let searchMetric = await prisma.analyticsSearchMetrics.findUnique({
        where: {
          date_searchTerm: {
            date: today,
            searchTerm
          }
        }
      });

      const updates = {};
      if (clicked) updates.clickThrough = { increment: 1 };
      if (converted) updates.conversions = { increment: 1 };

      if (searchMetric) {
        if (Object.keys(updates).length > 0) {
          await prisma.analyticsSearchMetrics.update({
            where: {
              date_searchTerm: {
                date: today,
                searchTerm
              }
            },
            data: updates
          });
        }
      } else {
        await prisma.analyticsSearchMetrics.create({
          data: {
            date: today,
            searchTerm,
            category,
            resultCount,
            clickThrough: clicked ? 1 : 0,
            conversions: converted ? 1 : 0
          }
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error tracking search metrics:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process queued events in batch
   */
  async processBatch() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      await prisma.analyticsEvent.createMany({
        data: batch,
        skipDuplicates: true
      });

      console.log(`Processed batch of ${batch.length} analytics events`);
    } catch (error) {
      console.error("Error processing analytics batch:", error);
      // Re-add failed events to queue for retry
      this.queue.unshift(...batch);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Start the batch processor timer
   */
  startBatchProcessor() {
    setInterval(async () => {
      await this.processBatch();
    }, this.flushInterval);
  }

  /**
   * Get analytics summary for admin dashboard
   */
  async getAnalyticsSummary(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const events = await prisma.analyticsEvent.groupBy({
        by: ['eventType'],
        where: {
          timestamp: {
            gte: startDate
          }
        },
        _count: {
          id: true
        }
      });

      const summary = {};
      events.forEach(event => {
        summary[event.eventType] = event._count.id;
      });

      return summary;
    } catch (error) {
      console.error("Error getting analytics summary:", error);
      return {};
    }
  }

  /**
   * Clean up old events (for data retention)
   */
  async cleanupOldEvents(daysToKeep = 365) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await prisma.analyticsEvent.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      console.log(`Cleaned up ${result.count} old analytics events`);
      return result;
    } catch (error) {
      console.error("Error cleaning up old events:", error);
      return { count: 0 };
    }
  }
}

// Export singleton instance
module.exports = new AnalyticsService();
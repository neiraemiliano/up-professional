// src/services/booking.service.js
const BaseService = require("./base.service");
const bookingRepo = require("../repositories/BookingRepository");
const analyticsService = require("./analytics.service");

class BookingService extends BaseService {
  constructor() {
    super(bookingRepo);
  }

  // Override create method to add analytics tracking
  async create(data, userContext = {}) {
    const booking = await super.create(data);
    
    // Track booking creation event
    if (booking && booking.id) {
      analyticsService.trackBookingCreation(
        data.userId,
        data.professionalId || null,
        booking.id,
        data.estimatedPrice || 0,
        userContext.sessionId,
        {
          serviceId: data.serviceId,
          bookingDate: data.bookingDate,
          includesMaterials: data.includesMaterials || false
        }
      ).catch(err => console.error("Analytics tracking error:", err));
    }

    return booking;
  }

  // Override update method to track status changes
  async update(id, data, userContext = {}) {
    const updated = await super.update(id, data);
    
    // Track booking status changes
    if (updated && data.status) {
      analyticsService.track({
        eventType: 'booking_status_change',
        category: 'booking',
        action: 'update',
        label: data.status,
        userId: userContext.userId,
        bookingId: id,
        sessionId: userContext.sessionId,
        metadata: {
          newStatus: data.status,
          paymentStatus: data.paymentStatus
        }
      }).catch(err => console.error("Analytics tracking error:", err));
    }

    return updated;
  }
}

module.exports = new BookingService();

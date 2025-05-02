// src/services/booking.service.js
const BaseService = require("./base.service");
const bookingRepo = require("../repositories/BookingRepository");

class BookingService extends BaseService {
  constructor() {
    super(bookingRepo);
  }
  // Métodos específicos de Booking
}

module.exports = new BookingService();

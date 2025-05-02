class Booking {
  constructor({ id, userId, serviceId, status, bookingDate, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.serviceId = serviceId;
    this.status = status;
    this.bookingDate = new Date(bookingDate);
    this.createdAt = createdAt;
  }
}

module.exports = Booking;

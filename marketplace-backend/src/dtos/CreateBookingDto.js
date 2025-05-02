const Joi = require("joi");

const createBookingSchema = Joi.object({
  userId: Joi.number().integer().required(),
  serviceId: Joi.number().integer().required(),
  status: Joi.string().required(),
  bookingDate: Joi.date().iso().required(),
});

module.exports = createBookingSchema;

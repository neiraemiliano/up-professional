const Joi = require("joi");

const createLocationSchema = Joi.object({
  professionalId: Joi.number().integer().required(),
  city: Joi.string().allow(null, ""),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});

module.exports = createLocationSchema;

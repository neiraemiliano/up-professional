const Joi = require("joi");

const createLocationSchema = Joi.object({
  city: Joi.string().required(),
  province: Joi.string().required().default(""),
  country: Joi.string().required().default("Argentina"),
  postalCode: Joi.string().required().default(""),
});

module.exports = createLocationSchema;

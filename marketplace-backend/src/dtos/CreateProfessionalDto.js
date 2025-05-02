const Joi = require("joi");

const createProfessionalSchema = Joi.object({
  userId: Joi.number().integer().required(),
  description: Joi.string().allow(null, ""),
  experience: Joi.number().integer().min(0).required(),
});

module.exports = createProfessionalSchema;

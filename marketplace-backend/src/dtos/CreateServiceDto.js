const Joi = require("joi");

const createServiceSchema = Joi.object({
  professionalId: Joi.number().integer().required(),
  categoryId: Joi.number().integer().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  price: Joi.number().precision(2).required(),
});

module.exports = createServiceSchema;

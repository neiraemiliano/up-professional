const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().allow(null, ""),
});

module.exports = createCategorySchema;

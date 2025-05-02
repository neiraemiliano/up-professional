const Joi = require("joi");

const createReviewSchema = Joi.object({
  userId: Joi.number().integer().required(),
  professionalId: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow(null, ""),
});

module.exports = createReviewSchema;

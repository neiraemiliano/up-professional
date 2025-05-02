// src/services/review.service.js
const BaseService = require("./base.service");
const reviewRepo = require("../repositories/ReviewRepository");

class ReviewService extends BaseService {
  constructor() {
    super(reviewRepo);
  }
  // Métodos específicos de Review
}

module.exports = new ReviewService();

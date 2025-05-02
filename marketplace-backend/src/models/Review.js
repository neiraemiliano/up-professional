class Review {
  constructor({ id, userId, professionalId, rating, comment, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.professionalId = professionalId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}

module.exports = Review;

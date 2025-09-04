class Review {
  constructor({ 
    id, 
    userId, 
    professionalId, 
    rating, 
    comment, 
    aspectRatings, 
    isAnonymous = false, 
    wouldRecommend = true, 
    serviceDate, 
    helpful = 0, 
    service, 
    createdAt, 
    updatedAt 
  }) {
    this.id = id;
    this.userId = userId;
    this.professionalId = professionalId;
    this.rating = rating;
    this.comment = comment;
    this.aspectRatings = aspectRatings; // JSON object with aspect ratings
    this.isAnonymous = isAnonymous;
    this.wouldRecommend = wouldRecommend;
    this.serviceDate = serviceDate;
    this.helpful = helpful;
    this.service = service;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Review;

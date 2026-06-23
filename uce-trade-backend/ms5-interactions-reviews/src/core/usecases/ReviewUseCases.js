// src/core/usecases/ReviewUseCases.js
const Review = require('../domain/Review');

class ReviewUseCases {
  // Reversal of Dependencies
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async createReview(data) {
    const review = new Review(data);
    review.validate(); // Validate business rules before saving

    // Send to save in the database
    await this.reviewRepository.save(review);
    return review;
  }

  async getReviewsByVenture(ventureId) {
    if (!ventureId) throw new Error("Venture ID is required to fetch reviews");
    
    // Get the reviews from the repository
    return await this.reviewRepository.findByVentureId(ventureId);
  }
}

module.exports = ReviewUseCases;
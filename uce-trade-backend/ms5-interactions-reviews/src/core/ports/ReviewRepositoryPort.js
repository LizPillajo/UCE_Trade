// src/core/ports/ReviewRepositoryPort.js
class ReviewRepositoryPort {
  async save(review) {
    throw new Error("Method 'save' must be implemented");
  }
  async findByVentureId(ventureId) {
    throw new Error("Method 'findByVentureId' must be implemented");
  }
}

module.exports = ReviewRepositoryPort;
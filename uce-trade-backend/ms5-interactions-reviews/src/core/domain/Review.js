// src/core/domain/Review.js
const { v4: uuidv4 } = require('uuid');

class Review {
  constructor({ id, ventureId, userId, userName, userAvatar, rating, comment, createdAt }) {
    this.id = id || uuidv4();
    this.ventureId = ventureId;
    this.userId = userId;
    this.userName = userName;
    this.userAvatar = userAvatar || '';
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt || new Date();
  }

  validate() {
    if (!this.ventureId) throw new Error("Venture ID is required");
    if (!this.userId) throw new Error("User ID is required");
    if (this.rating < 1 || this.rating > 5) throw new Error("Rating must be between 1 and 5");
    if (!this.comment || this.comment.trim().length === 0) throw new Error("Comment cannot be empty");
  }
}

module.exports = Review;
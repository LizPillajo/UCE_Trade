// src/adapters/out/database/ReviewRepository.js
const { client } = require('../../../config/cassandra');

class ReviewRepository {
  async save(review) {
    const query = `
      INSERT INTO uce_trade_reviews.reviews 
      (id, venture_id, user_id, user_name, user_avatar, rating, comment, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      review.id, 
      review.ventureId, 
      review.userId, 
      review.userName, 
      review.userAvatar, 
      review.rating, 
      review.comment, 
      review.createdAt
    ];

    await client.execute(query, params, { prepare: true });
  }

  async findByVentureId(ventureId) {
    const query = `SELECT * FROM uce_trade_reviews.reviews WHERE venture_id = ?`;
    const result = await client.execute(query, [ventureId], { prepare: true });
    return result.rows;
  }
}

module.exports = ReviewRepository;
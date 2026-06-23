// src/adapters/in/http/ReviewController.js
const express = require('express');
const logger = require('../../../config/logger');

function createReviewController(reviewUseCases) {
  const router = express.Router();

  router.get('/:ventureId/reviews', async (req, res) => {
    try {
      const reviews = await reviewUseCases.getReviewsByVenture(req.params.ventureId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/:ventureId/reviews', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "The authentication token is missing" });
      }

      const token = authHeader.split(' ')[1];
      const payloadBase64 = token.split('.')[1];
      const payloadBuffer = Buffer.from(payloadBase64, 'base64');
      const payloadData = JSON.parse(payloadBuffer.toString('utf-8'));

      const { rating, comment } = req.body;
      
      const reviewData = {
        ventureId: req.params.ventureId,
        userId: payloadData.user_id || payloadData.sub,
        userName: payloadData.name || payloadData.email.split('@')[0], 
        userAvatar: payloadData.picture || '',
        rating,
        comment
      };

      const newReview = await reviewUseCases.createReview(reviewData);
      logger.info(`✅ New review created for the venture: ${req.params.ventureId} by user: ${reviewData.userId}`);
      res.status(201).json(newReview);
      
    } catch (error) {
      logger.error(`❌ Error to create review: ${error.message}`, { stack: error.stack });
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createReviewController;
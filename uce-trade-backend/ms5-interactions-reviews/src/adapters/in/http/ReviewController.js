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
      let token = null;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.headers.cookie) {
        const cookies = req.headers.cookie.split(';');
        for (let cookie of cookies) {
          const [name, val] = cookie.trim().split('=');
          if (name === 'access_token') {
            token = val;
            break;
          }
        }
      }

      if (!token) {
        return res.status(401).json({ error: "The authentication token is missing" });
      }

      const payloadBase64 = token.split('.')[1];
      const payloadBuffer = Buffer.from(payloadBase64, 'base64');
      const payloadData = JSON.parse(payloadBuffer.toString('utf-8'));

      const { rating, comment } = req.body;
      
      const reviewData = {
        ventureId: req.params.ventureId,
        userId: payloadData.user_id || payloadData.sub,
        userName: payloadData.name || (payloadData.email ? payloadData.email.split('@')[0] : 'UnknownUser'), 
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
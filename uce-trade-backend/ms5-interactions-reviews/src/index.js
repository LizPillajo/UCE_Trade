// src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const { initDB } = require('./config/cassandra');
const ReviewRepository = require('./adapters/out/database/ReviewRepository');
const ReviewUseCases = require('./core/usecases/ReviewUseCases');
const createReviewController = require('./adapters/in/http/ReviewController');
const { initKafkaConsumer } = require('./adapters/out/messaging/KafkaConsumer');

const app = express();
app.use(cors());
app.use(express.json());

// --- SWAGGER ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'MS5 Interactions & Reviews API',
      version: '1.0.0',
      description: 'Microservice to manage reviews of services in UCE Trade',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 8084}` }],
    paths: {
      '/api/v1/ventures/{ventureId}/reviews': {
        get: {
          summary: 'Get all reviews for a venture',
          tags: ['Reviews'],
          parameters: [{ in: 'path', name: 'ventureId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'List of reviews' } }
        },
        post: {
          summary: 'Create a new review (Requires token)',
          tags: ['Reviews'],
          parameters: [{ in: 'path', name: 'ventureId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { rating: { type: 'integer' }, comment: { type: 'string' } } }
              }
            }
          },
          responses: { 201: { description: 'Review created' } }
        }
      }
    }
  },
  apis: [], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Dependency Injection ---
const reviewRepo = new ReviewRepository();
const reviewUseCases = new ReviewUseCases(reviewRepo);
const reviewController = createReviewController(reviewUseCases);

// --- Routes ---
app.use('/api/v1/ventures', reviewController);

const PORT = process.env.PORT || 8084;

// --- Initialization ---
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 MS5 Interactions & Reviews running at the port ${PORT}`);
    console.log(`📚 Swagger en http://localhost:${PORT}/swagger-ui`);
  });
  
  initKafkaConsumer();
});
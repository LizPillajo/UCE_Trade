const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const logger = require('./utils/logger');

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
    logger.info(`🚀 MS5 Interactions & Reviews running at port ${PORT}`);
    logger.info(`📚 Swagger at http://localhost:${PORT}/swagger-ui`);
  });
  
  // ✅ FIX: Don't block startup if Kafka fails
  initKafkaConsumer().catch(err => {
    logger.warn(`⚠️ Kafka initialization failed (will retry): ${err.message}`);
  });
});
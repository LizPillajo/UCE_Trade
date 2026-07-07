const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MS8 Real-Time Notifications API',
      version: '1.0.0',
      description: 'API for fetching real-time notifications cached in Redis.',
    },
    servers: [
      {
        url: 'http://localhost:3008',
        description: 'Local development server',
      },
      {
        url: 'http://localhost:8000',
        description: 'API Gateway',
      },
    ],
  },
  apis: ['./src/index.js'], // Files containing annotations as above
};

const specs = swaggerJsdoc(options);

module.exports = specs;

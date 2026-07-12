require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectRedis } = require('./config/redis.config');
const { connectRabbitMQ } = require('./config/rabbitmq.config');
const { connectMQTT } = require('./config/mqtt.config');
const { startConsumer } = require('./adapters/input/rabbitmq.consumer');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger.config');
const logger = require('./utils/logger');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger Documentation Route
app.use('/api/v1/notifications/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT || 3008;

const { getRecentNotifications, markNotificationAsRead } = require('./adapters/output/redis.repository');

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'ms8-real-time-notifications' });
});

/**
 * @swagger
 * /api/v1/notifications/{userId}:
 *   get:
 *     summary: Retrieve recent notifications for a user
 *     description: Fetches the last 50 notifications from the Redis cache for the specified user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: An array of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   type:
 *                     type: string
 *                   title:
 *                     type: string
 *                   message:
 *                     type: string
 *                   read:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
app.get('/api/v1/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await getRecentNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/v1/notifications/:userId/:notificationId/read', async (req, res) => {
  try {
    const { userId, notificationId } = req.params;
    await markNotificationAsRead(userId, notificationId);
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, async () => {
  logger.info(`[MS8] Real-Time Notifications running on port ${PORT}`);
  
  try {
    await connectRedis();
    await connectRabbitMQ();
    await connectMQTT();
    await startConsumer();
  } catch (error) {
    logger.error('Failed to initialize messaging services:', error);
    process.exit(1);
  }
});

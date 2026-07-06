require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectRedis } = require('./config/redis.config');
const { connectRabbitMQ } = require('./config/rabbitmq.config');
const { connectMQTT } = require('./config/mqtt.config');
const { startConsumer } = require('./adapters/input/rabbitmq.consumer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3008;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'ms8-real-time-notifications' });
});

app.listen(PORT, async () => {
  console.log(`[MS8] Real-Time Notifications running on port ${PORT}`);
  
  try {
    await connectRedis();
    await connectRabbitMQ();
    await connectMQTT();
    await startConsumer();
  } catch (error) {
    console.error('Failed to initialize messaging services:', error);
  }
});

const amqp = require('amqplib');
const logger = require('../utils/logger');

let channel = null;

const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  const amqpServer = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(amqpServer);
      channel = await connection.createChannel();
      logger.info('[RabbitMQ] Connected successfully');
      return channel;
    } catch (error) {
      logger.warn(`[RabbitMQ] Connection failed, retrying in ${delay/1000}s... (${i + 1}/${retries})`);
      if (i === retries - 1) {
        logger.error('[RabbitMQ] Connection error after max retries:', error);
        throw error;
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not established');
  }
  return channel;
};

module.exports = { connectRabbitMQ, getChannel };

const amqp = require('amqplib');
const logger = require('../utils/logger');

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const amqpServer = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    logger.info('[RabbitMQ] Connected successfully');
    return channel;
  } catch (error) {
    logger.error('[RabbitMQ] Connection error:', error);
    throw error;
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not established');
  }
  return channel;
};

module.exports = { connectRabbitMQ, getChannel };

const { getChannel } = require('../../config/rabbitmq.config');
const { processPaymentSuccess } = require('../../core/usecases/ProcessEventUseCase');
const logger = require('../../utils/logger');

const EXCHANGE_NAME = 'payments-exchange';
const ROUTING_KEY = 'payment.success';
const QUEUE_NAME = 'ms8.notifications.payment.queue';

const startConsumer = async () => {
  const channel = getChannel();

  // Ensure exchange exists
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  
  // Ensure queue exists
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  
  // Bind queue to exchange with routing key
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

  logger.info(`[RabbitMQ] Listening for messages on queue: ${QUEUE_NAME}`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg !== null) {
      try {
        const payload = JSON.parse(msg.content.toString());
        logger.info('[RabbitMQ] Received message:', { payload });
        
        await processPaymentSuccess(payload);
        
        channel.ack(msg);
      } catch (error) {
        logger.error('[RabbitMQ] Error processing message:', error);
        // Nack without requeue for simple error handling
        channel.nack(msg, false, false);
      }
    }
  });
};

module.exports = { startConsumer };

// src/adapters/out/messaging/KafkaConsumer.js
const { Kafka } = require('kafkajs');
const logger = require('../../../config/logger');

const kafka = new Kafka({
  clientId: 'ms5-reviews',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 2000,
    retries: 10 
  }
});

const consumer = kafka.consumer({ groupId: 'reviews-group' });

const initKafkaConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'venture-created-topic', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const ventureData = JSON.parse(message.value.toString());
        logger.info(`🎧 [Kafka MS5] Event received. New venture detected: "${ventureData.title}". Section of reviews enabled.`);
      },
    });
    
    logger.info('✅ Kafka consumer connected successfully to MS5.');
  } catch (error) {
    logger.error(`❌ Kafka isn't ready yet (${error.message}). Retrying in 5 seconds...`, { stack: error.stack });
    setTimeout(initKafkaConsumer, 5000);
  }
};

module.exports = { initKafkaConsumer };
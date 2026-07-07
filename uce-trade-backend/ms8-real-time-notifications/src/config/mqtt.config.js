const mqtt = require('mqtt');
const logger = require('../utils/logger');

let mqttClient = null;

const connectMQTT = () => {
  return new Promise((resolve, reject) => {
    const brokerUrl = process.env.MQTT_URL || 'mqtt://localhost:1883';
    mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on('connect', () => {
      logger.info('[MQTT] Connected successfully to Mosquitto');
      resolve(mqttClient);
    });

    mqttClient.on('error', (err) => {
      logger.error('[MQTT] Connection error:', err);
      reject(err);
    });
  });
};

const getMQTTClient = () => {
  if (!mqttClient) {
    throw new Error('MQTT client not established');
  }
  return mqttClient;
};

module.exports = { connectMQTT, getMQTTClient };

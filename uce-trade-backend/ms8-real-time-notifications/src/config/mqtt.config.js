const mqtt = require('mqtt');

let mqttClient = null;

const connectMQTT = () => {
  return new Promise((resolve, reject) => {
    const brokerUrl = process.env.MQTT_URL || 'mqtt://localhost:1883';
    mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on('connect', () => {
      console.log('[MQTT] Connected successfully to Mosquitto');
      resolve(mqttClient);
    });

    mqttClient.on('error', (err) => {
      console.error('[MQTT] Connection error:', err);
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

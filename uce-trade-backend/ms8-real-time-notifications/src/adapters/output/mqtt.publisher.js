const { getMQTTClient } = require('../../config/mqtt.config');

const publishNotification = (notification) => {
  const client = getMQTTClient();
  const { userId } = notification;
  
  // Topic matching frontend subscription: notifications/user/{userId}
  // Let's use the one from frontend for admin and students.
  // We'll define a standard topic.
  const topic = `notifications/user/${userId}`;
  
  const payload = JSON.stringify(notification.toJSON());

  client.publish(topic, payload, { qos: 1 }, (err) => {
    if (err) {
      console.error(`[MQTT] Failed to publish to ${topic}:`, err);
    } else {
      console.log(`[MQTT] Successfully published to ${topic}`);
    }
  });
};

module.exports = { publishNotification };

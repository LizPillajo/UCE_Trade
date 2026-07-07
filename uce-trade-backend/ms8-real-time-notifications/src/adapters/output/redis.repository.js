const { redisClient } = require('../../config/redis.config');

const saveNotification = async (notification) => {
  const { userId } = notification;
  const key = `notifications:${userId}`;
  const notificationStr = JSON.stringify(notification.toJSON());

  // LPUSH to add to the beginning of the list
  await redisClient.lPush(key, notificationStr);
  
  // Keep only the last 50 notifications
  await redisClient.lTrim(key, 0, 49);
};

const getRecentNotifications = async (userId) => {
  const key = `notifications:${userId}`;
  const data = await redisClient.lRange(key, 0, -1);
  return data.map(str => JSON.parse(str));
};

module.exports = {
  saveNotification,
  getRecentNotifications
};

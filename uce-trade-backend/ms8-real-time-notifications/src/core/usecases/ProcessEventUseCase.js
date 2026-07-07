const Notification = require('../domain/Notification');
const { saveNotification } = require('../../adapters/output/redis.repository');
const { publishNotification } = require('../../adapters/output/mqtt.publisher');

const processPaymentSuccess = async (paymentData) => {
  // Format for Student (or Admin)
  const notification = new Notification({
    userId: paymentData.studentId, // We send to student
    type: 'PAYMENT_SUCCESS',
    title: 'Payment Successful',
    message: `Your payment of $${paymentData.amount} for venture ${paymentData.ventureId} was successful.`
  });

  await saveNotification(notification);
  publishNotification(notification);
  
  return notification;
};

// You can add more processors here (e.g., processSaleAlert)

module.exports = {
  processPaymentSuccess
};

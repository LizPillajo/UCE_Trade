const Notification = require('../domain/Notification');
const { saveNotification } = require('../../adapters/output/redis.repository');
const { publishNotification } = require('../../adapters/output/mqtt.publisher');

const processPaymentSuccess = async (paymentData) => {
  let ventureTitle = paymentData.ventureId;
  try {
    const response = await fetch(`http://host.docker.internal:8082/api/v1/catalog/ventures`);
    if (response.ok) {
      const ventures = await response.json();
      const ventureData = ventures.find(v => v.id === paymentData.ventureId);
      if (ventureData && ventureData.title) {
        ventureTitle = ventureData.title;
      }
    }
  } catch (e) {
    console.error('Failed to fetch venture title:', e);
  }

  // Format for Student (or Admin)
  const notification = new Notification({
    userId: paymentData.studentId, // We send to student
    type: 'PAYMENT_SUCCESS',
    title: 'Payment Successful',
    message: `Your payment of $${paymentData.amount} for venture "${ventureTitle}" was successful.`
  });

  await saveNotification(notification);
  publishNotification(notification);
  
  return notification;
};

// You can add more processors here (e.g., processSaleAlert)

module.exports = {
  processPaymentSuccess
};

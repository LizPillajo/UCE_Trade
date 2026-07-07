const Notification = require('../domain/Notification');
const { saveNotification } = require('../../adapters/output/redis.repository');
const { publishNotification } = require('../../adapters/output/mqtt.publisher');

const processPaymentSuccess = async (paymentData) => {
  let ventureTitle = paymentData.ventureId;
  let sellerId = null;
  
  try {
    const response = await fetch(`http://host.docker.internal:8082/api/v1/catalog/ventures`);
    if (response.ok) {
      const ventures = await response.json();
      const ventureData = ventures.find(v => v.id === paymentData.ventureId);
      if (ventureData) {
        if (ventureData.title) ventureTitle = ventureData.title;
        if (ventureData.studentId) sellerId = ventureData.studentId;
      }
    }
  } catch (e) {
    console.error('Failed to fetch venture title:', e);
  }

  // Format for Buyer (Student making the payment)
  const buyerNotification = new Notification({
    userId: paymentData.studentId,
    type: 'PAYMENT_SUCCESS',
    title: 'Payment Successful',
    message: `Your payment of $${paymentData.amount} for venture "${ventureTitle}" was successful.`
  });

  await saveNotification(buyerNotification);
  publishNotification(buyerNotification);
  
  // Format for Seller
  if (sellerId) {
    const sellerNotification = new Notification({
      userId: sellerId,
      type: 'NEW_SALE',
      title: 'New Sale Received',
      message: `You have received a new payment of $${paymentData.amount} for your venture "${ventureTitle}".`
    });

    await saveNotification(sellerNotification);
    publishNotification(sellerNotification);
  }
  
  return buyerNotification;
};

// You can add more processors here (e.g., processSaleAlert)

module.exports = {
  processPaymentSuccess
};

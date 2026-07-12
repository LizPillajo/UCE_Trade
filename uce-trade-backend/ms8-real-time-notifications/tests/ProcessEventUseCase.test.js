const { processPaymentSuccess } = require('../src/core/usecases/ProcessEventUseCase');
const { saveNotification } = require('../src/adapters/output/redis.repository');
const { publishNotification } = require('../src/adapters/output/mqtt.publisher');

// Mock output adapters
jest.mock('../src/adapters/output/redis.repository');
jest.mock('../src/adapters/output/mqtt.publisher');

describe('ProcessEventUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 'venture-999', title: 'Test Venture Title' }]),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should format payment data into a Notification, save to Redis, and publish to MQTT', async () => {
    const paymentData = {
      id: 'pay-123',
      studentId: 'student-test-001',
      amount: 50.0,
      ventureId: 'venture-999'
    };

    saveNotification.mockResolvedValue();
    publishNotification.mockImplementation(() => {});

    const notification = await processPaymentSuccess(paymentData);

    expect(notification).toBeDefined();
    expect(notification.userId).toBe('student-test-001');
    expect(notification.type).toBe('PAYMENT_SUCCESS');
    expect(notification.title).toBe('Payment Successful');
    expect(notification.message).toContain('50');

    expect(saveNotification).toHaveBeenCalledTimes(1);
    expect(saveNotification).toHaveBeenCalledWith(notification);

    expect(publishNotification).toHaveBeenCalledTimes(1);
    expect(publishNotification).toHaveBeenCalledWith(notification);
  });
});

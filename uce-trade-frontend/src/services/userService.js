import api from './axiosInstance';

export const fetchUserProfile = async (uid) => {
  const response = await api.get(`/v1/users/${uid}`);
  return response.data;
};

export const updateUserProfile = async (uid, userData) => {
  const response = await api.put(`/v1/users/${uid}`, userData);
  return response.data;
};

export const fetchNotifications = async () => {
    const response = await api.get('/notifications/my-notifications');
    return response.data;
};

export const downloadInvoice = async (ventureId, studentId) => {
  const response = await api.get(`/v1/billing/invoice/${ventureId}?studentId=${studentId}`);
  if (response.data && response.data.pdfUrl) {
    window.open(response.data.pdfUrl, '_blank');
  } else {
    throw new Error("Invoice not found or pdfUrl is missing");
  }
};

export const confirmPayment = async (ventureId, amount) => {
  const response = await api.post(`/v1/payments/confirm/${ventureId}`, { amount });
  return response.data;
};
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

export const downloadInvoice = async (ventureId) => {
  const response = await api.get(`/payments/invoice/${ventureId}`, { responseType: 'blob' });
  return response.data;
};

export const confirmPayment = async (ventureId) => {
  const response = await api.post(`/payments/confirm/${ventureId}`);
  return response.data;
};
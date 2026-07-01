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
  const response = await api.get(`/v1/payments/invoice/${ventureId}`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice-${ventureId}.pdf`);
  document.body.appendChild(link);
  link.click();
};

export const confirmPayment = async (ventureId, amount) => {
  const response = await api.post(`/v1/payments/confirm/${ventureId}`, { amount });
  return response.data;
};
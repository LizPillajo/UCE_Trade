import api from './axiosInstance';

// --- PERFIL ---
export const fetchUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// --- NOTIFICACIONES ---
export const fetchNotifications = async () => {
    const response = await api.get('/notifications/my-notifications');
    return response.data;
};

// --- PAGOS ---
export const downloadInvoice = async (ventureId) => {
  const response = await api.get(`/payments/invoice/${ventureId}`, { responseType: 'blob' });
  return response.data;
};

export const confirmPayment = async (ventureId) => {
  const response = await api.post(`/payments/confirm/${ventureId}`);
  return response.data;
};
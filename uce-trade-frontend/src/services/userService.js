import api from './axiosInstance';

export const fetchUserProfile = async (uid) => {
  const response = await api.get(`/v1/users/${uid}`);
  return response.data;
};

export const updateUserProfile = async (uid, userData) => {
  const response = await api.put(`/v1/users/${uid}`, userData);
  return response.data;
};
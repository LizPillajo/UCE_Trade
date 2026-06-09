import api from './axiosInstance';

export const authenticateWithMS1 = async (firebaseToken) => {
  try {
    const response = await api.post('/v1/auth/login', {}, {
      headers: { Authorization: `Bearer ${firebaseToken}` }
    });
    return response.data; // User PostgreSQL
  } catch (error) {
    console.error("Error autenticando con MS1:", error);
    throw error.response ? error.response.data : new Error("Connection error");
  }
};
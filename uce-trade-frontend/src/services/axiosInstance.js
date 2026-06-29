// src/services/axiosInstance.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore'; 
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Expired Session (401)
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/v1/auth/login');
      
      if (!isAuthEndpoint) {
        const logout = useAuthStore.getState().logout;      
        logout();
        toast.error("⚠️ Your session has expired. Please log in again.", {
            position: "top-center", 
            autoClose: 3000,
        });
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
      }
    }

    // 2. Rate Limiting
    if (error.response?.status === 429) {
      toast.warning("⏳ Please wait a moment! You have made too many requests in a short period.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: true,
        style: {
          borderRadius: '16px',
          fontWeight: 'bold',
          color: '#0d2149', 
          backgroundColor: '#fff8e1', 
          border: '1px solid #efb034', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;
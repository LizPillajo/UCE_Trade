import axios from 'axios';
import { useAuthStore } from '../store/authStore'; 
import { toast } from 'react-toastify';

const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
        const logout = useAuthStore.getState().logout;      
        logout();
        
        toast.error("⚠️ Sesión caducada. Por favor, inicia sesión nuevamente.", {
            position: "top-center", 
            autoClose: 3000,
        });

        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    }
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';
import { useAuthStore } from '../store/authStore'; 
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

let isLoggingOut = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      
      if (isLoggingOut) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const user = useAuthStore.getState().user;
        const refreshToken = user?.refreshToken;

        if (refreshToken) {
            console.log("🔄 Token de 15min expiró. Usando RefreshToken para renovar...");

            await axios.post(`${BASE_URL}/auth/refreshtoken`, {
                refreshToken: refreshToken
            }, { withCredentials: true });

            console.log("✅ Token renovado. Reintentando la petición original...");
            return api(originalRequest);
        }
      } catch (refreshError) {
        if (!isLoggingOut) {
            isLoggingOut = true; 
            console.error("❌ El Refresh Token expiró:", refreshError);
            
            const logout = useAuthStore.getState().logout;      
            logout();
            
            toast.error("⚠️ Tu sesión ha caducado. Serás redirigido al login...", {
                position: "top-center", 
                autoClose: 4000,        
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
            });

            setTimeout(() => {
                window.location.href = '/login';
            }, 3500);
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
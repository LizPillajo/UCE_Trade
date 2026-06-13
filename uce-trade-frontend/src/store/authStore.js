import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Acción de Login
      login: (userData) => {
        set({ 
          user: userData, 
          isAuthenticated: true 
        });
      },

      // Acción de Logout
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        localStorage.removeItem('auth-storage'); 
      },

      // Actualizar datos del usuario en vivo 
      updateUser: (newData) => {
        set((state) => ({
          user: { ...state.user, ...newData }
        }));
      }
    }),
    {
      name: 'auth-storage', // Nombre de la key en localStorage
    }
  )
);
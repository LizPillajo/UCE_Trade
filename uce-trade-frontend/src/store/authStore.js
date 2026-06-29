import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        set({ 
          user: {
            uid: userData.uid,
            name: userData.fullName || userData.name,
            role: userData.role,
            email: userData.email,
            faculty: userData.faculty,
            avatar: userData.avatarUrl || userData.avatar || '',
            phoneNumber: userData.phoneNumber || '',
            githubUser: userData.githubUser || '',
            description: userData.description || '',
          },
          token: token,
          isAuthenticated: true 
        });
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        localStorage.removeItem('auth-storage'); 
      },

      updateUser: (newData) => {
        set((state) => ({
          user: { ...state.user, ...newData }
        }));
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
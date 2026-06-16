import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import { useAuthStore} from '../store/authStore';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  
  const clientRef = useRef(null);

  useEffect(() => {
    if (!user || clientRef.current) return;

    console.log("🔌 Iniciando conexión WebSocket...");

    const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
    
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ SOCKET CONECTADO');

        if (user.role === 'UCE_STUDENT') {
          client.subscribe(`/topic/sales/${user.email}`, (message) => {
            const notif = JSON.parse(message.body);
            toast.success(`💰 ${notif.title}: ${notif.body}`, { toastId: 'sale-notif' });
            
            queryClient.invalidateQueries({ queryKey: ['studentStats'] });
            queryClient.invalidateQueries({ queryKey: ['myVentures'] });
          });
        }

        // Suscripción Admin (General)
        if (user.role === 'UCE_ADMIN') {
          client.subscribe('/topic/admin/notifications', (msg) => {
            const notif = JSON.parse(msg.body);
            toast.info(`🔔 ${notif.title}: ${notif.body}`, { toastId: 'admin-notif' });
            
            // Recargar Dashboard
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
          });
        }
      },
      onStompError: (frame) => {
        console.error('❌ Error STOMP:', frame.headers['message']);
      }
    });

    client.activate();
    clientRef.current = client; 

    return () => {
      console.log("🛑 Limpiando socket...");
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [user, queryClient]); 
};
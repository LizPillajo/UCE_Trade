import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import mqtt from 'mqtt';
import { toast } from 'react-toastify';
import { useAuthStore} from '../store/authStore';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  
  const stompClientRef = useRef(null);
  const mqttClientRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // --- STOMP Connection (Real-Time Notifications) ---
    if (!stompClientRef.current) {
        console.log("🔌 Iniciando conexión STOMP...");
        const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
        
        const stompClient = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('✅ STOMP SOCKET CONECTADO');

            if (user.role === 'UCE_STUDENT') {
            stompClient.subscribe(`/topic/sales/${user.email}`, (message) => {
                const notif = JSON.parse(message.body);
                toast.success(`💰 ${notif.title}: ${notif.body}`, { toastId: 'sale-notif' });
                
                queryClient.invalidateQueries({ queryKey: ['studentStats'] });
                queryClient.invalidateQueries({ queryKey: ['myVentures'] });
            });
            }

            if (user.role === 'UCE_ADMIN') {
            stompClient.subscribe('/topic/admin/notifications', (msg) => {
                const notif = JSON.parse(msg.body);
                toast.info(`🔔 ${notif.title}: ${notif.body}`, { toastId: 'admin-notif' });
                
                queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            });
            }
        },
        onStompError: (frame) => {
            console.error('❌ Error STOMP:', frame.headers['message']);
        }
        });

        stompClient.activate();
        stompClientRef.current = stompClient;
    }

    // --- MQTT Connection (Analytics Dashboards) ---
    if (!mqttClientRef.current) {
        console.log("🔌 Iniciando conexión MQTT...");
        const MQTT_URL = import.meta.env.VITE_MQTT_WS_URL || 'ws://localhost:9001';
        
        const mqttClient = mqtt.connect(MQTT_URL, {
            clientId: `react-client-${user.id}-${Math.random().toString(16).slice(2)}`,
            clean: true,
            reconnectPeriod: 5000,
        });

        mqttClient.on('connect', () => {
            console.log('✅ MQTT SOCKET CONECTADO');
            
            if (user.role === 'UCE_ADMIN') {
                mqttClient.subscribe('analytics/admin', (err) => {
                    if (!err) console.log('📡 Suscrito a analytics/admin');
                });
            } else if (user.role === 'UCE_STUDENT') {
                mqttClient.subscribe(`analytics/student/${user.id}`, (err) => {
                    if (!err) console.log(`📡 Suscrito a analytics/student/${user.id}`);
                });
            }
        });

        mqttClient.on('message', (topic, message) => {
            console.log(`[MQTT] Mensaje recibido en ${topic}:`, message.toString());
            
            if (topic === 'analytics/admin') {
                queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            } else if (topic.startsWith('analytics/student/')) {
                queryClient.invalidateQueries({ queryKey: ['studentStats'] });
            }
        });

        mqttClient.on('error', (err) => {
            console.error('❌ Error MQTT:', err);
        });

        mqttClientRef.current = mqttClient;
    }

    return () => {
      console.log("🛑 Limpiando sockets...");
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      if (mqttClientRef.current) {
          mqttClientRef.current.end();
          mqttClientRef.current = null;
      }
    };
  }, [user, queryClient]); 
};
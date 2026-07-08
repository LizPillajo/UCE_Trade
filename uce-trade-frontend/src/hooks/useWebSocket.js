import { useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  
  const mqttClientRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // --- MQTT Connection (Analytics Dashboards & Notifications) ---
    if (!mqttClientRef.current) {
        console.log("🔌 Iniciando conexión MQTT...");
        const MQTT_URL = import.meta.env.VITE_MQTT_WS_URL || 'ws://localhost:9001';
        
        const mqttClient = mqtt.connect(MQTT_URL, {
            clientId: `react-client-${user.uid}-${Math.random().toString(16).slice(2)}`,
            clean: true,
            reconnectPeriod: 5000,
        });

        mqttClient.on('connect', () => {
            console.log('✅ MQTT SOCKET CONECTADO');
            
            // Suscribirse a las notificaciones personales
            mqttClient.subscribe(`notifications/user/${user.uid}`, (err) => {
                if (!err) console.log(`[MQTT] Suscrito a notifications/user/${user.uid}`);
            });
            
            if (user.role === 'UCE_ADMIN') {
                mqttClient.subscribe('analytics/admin', (err) => {
                    if (!err) console.log('📡 Suscrito a analytics/admin');
                });
            } else if (user.role === 'UCE_STUDENT') {
                mqttClient.subscribe(`analytics/student/${user.uid}`, (err) => {
                    if (!err) console.log(`📡 Suscrito a analytics/student/${user.uid}`);
                });
            }
        });

        mqttClient.on('message', (topic, message) => {
            console.log(`[MQTT] Mensaje recibido en ${topic}`);
            
            // Refrescar Dashboards
            if (topic === 'analytics/admin') {
                queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            } else if (topic.startsWith('analytics/student/')) {
                queryClient.invalidateQueries({ queryKey: ['studentStats'] });
                queryClient.invalidateQueries({ queryKey: ['myVentures'] });
            }
            
            // Mostrar Notificaciones (Toasts)
            if (topic.startsWith('notifications/user/')) {
                try {
                    const notif = JSON.parse(message.toString());
                    if (notif.type === 'NEW_SALE') {
                        toast.success(`🎉 ${notif.title}: ${notif.message}`, { toastId: `sale-${Date.now()}` });
                        // Refrescar al instante el dashboard del vendedor
                        queryClient.invalidateQueries({ queryKey: ['studentStats'] });
                    } else if (notif.type === 'PAYMENT_SUCCESS') {
                        toast.info(`💰 ${notif.title}: ${notif.message}`, { toastId: `pay-${Date.now()}` });
                    } else {
                        toast.info(`🔔 ${notif.title}: ${notif.message}`);
                    }
                    // Refrescar el contador visual (campanita)
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                } catch (e) {
                    console.error("Error parsing MQTT message:", e);
                }
            }
        });

        mqttClient.on('error', (err) => {
            console.error('❌ Error MQTT:', err);
        });

        mqttClientRef.current = mqttClient;
    }

    return () => {
      console.log("🛑 Limpiando sockets...");
      if (mqttClientRef.current) {
          mqttClientRef.current.end();
          mqttClientRef.current = null;
      }
    };
  }, [user, queryClient]); 
};
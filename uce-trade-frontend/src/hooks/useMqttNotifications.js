import { useEffect, useState, useRef } from 'react';
import mqtt from 'mqtt';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { useQueryClient } from '@tanstack/react-query';

export const useMqttNotifications = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [client, setClient] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!user || clientRef.current) return;

    console.log("🔌 Iniciando conexión MQTT por WebSockets...");

    const brokerUrl = import.meta.env.VITE_MQTT_URL || 'ws://localhost:9001';
    const mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on('connect', () => {
      console.log('✅ MQTT CONECTADO');
      const topic = `notifications/user/${user.id}`;
      
      mqttClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`[MQTT] Suscrito a ${topic}`);
        } else {
          console.error('[MQTT] Error en suscripción:', err);
        }
      });
      
      // Suscripción Admin (General) si es admin
      if (user.role === 'UCE_ADMIN') {
        mqttClient.subscribe('notifications/admin/#');
      }
    });

    mqttClient.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        if (user.role === 'UCE_STUDENT') {
          toast.success(`💰 ${payload.title}: ${payload.message}`, { toastId: payload.id || 'notif' });
          queryClient.invalidateQueries({ queryKey: ['studentStats'] });
          queryClient.invalidateQueries({ queryKey: ['myVentures'] });
        } else if (user.role === 'UCE_ADMIN') {
          toast.info(`🔔 ${payload.title}: ${payload.message}`, { toastId: payload.id || 'notif' });
          queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        }
      } catch (error) {
        console.error('[MQTT] Failed to parse message:', error);
      }
    });

    clientRef.current = mqttClient;
    setClient(mqttClient);

    return () => {
      console.log("🛑 Limpiando socket MQTT...");
      if (clientRef.current) {
        clientRef.current.end();
        clientRef.current = null;
      }
    };
  }, [user, queryClient]);

  return client;
};

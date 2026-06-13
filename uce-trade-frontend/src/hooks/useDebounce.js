// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

// Recibe un valor y un tiempo de espera (delay)
export function useDebounce(value, delay) {
  // Estado interno para el valor "retrasado"
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Temporizador que actualice el estado después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si el valor cambia antes de que termine el tiempo, se cancela el temporizador anterior. 
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
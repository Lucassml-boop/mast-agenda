import { useState, useEffect } from 'react';
import type { UseConnectionReturn, ConnectionStatus } from '../types';

export const useConnection = (): UseConnectionReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  useEffect(() => {
    const handleOnline = () => setConnectionStatus('connected');
    const handleOffline = () => setConnectionStatus('disconnected');

    // Verificar status inicial
    setConnectionStatus(navigator.onLine ? 'connected' : 'disconnected');

    // Escutar mudanças de conexão
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isConnected: connectionStatus === 'connected',
    connectionStatus
  };
};
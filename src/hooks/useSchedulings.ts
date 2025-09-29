import { useState, useEffect } from 'react';
import { 
  addScheduling as addSchedulingService, 
  deleteScheduling, 
  listenToSchedulings,
  cleanOldSchedulings as cleanOldSchedulingsService,
  cleanAllSchedulings as cleanAllSchedulingsService,
  checkDuplicateScheduling as checkDuplicateSchedulingService,
  debugSchedulings as debugSchedulingsService,
  type SchedulingData
} from '../firebase/schedulingService';
import type { UseSchedulingsReturn } from '../types';

export const useSchedulings = (): UseSchedulingsReturn => {
  const [schedulings, setSchedulings] = useState<SchedulingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Limpar dados antigos automaticamente
    const performCleanup = async () => {
      try {
        const deletedCount = await cleanOldSchedulingsService();
        if (deletedCount > 0) {
          console.log(`✅ Limpeza automática: ${deletedCount} agendamentos antigos removidos`);
        }
      } catch (error) {
        console.warn('⚠️ Erro na limpeza automática:', error);
      }
    };
    
    // Executar limpeza
    performCleanup();
    
    // Escutar mudanças em tempo real
    const unsubscribe = listenToSchedulings(
      (data) => {
        setSchedulings(data);
        setIsLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const addScheduling = async (data: Omit<SchedulingData, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      await addSchedulingService(data);
      setError(null);
    } catch (err) {
      const errorMessage = 'Erro ao adicionar agendamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const removeScheduling = async (id: string) => {
    try {
      await deleteScheduling(id);
      setError(null);
    } catch (err) {
      const errorMessage = 'Erro ao remover agendamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const cleanOldSchedulings = async (): Promise<number> => {
    try {
      return await cleanOldSchedulingsService();
    } catch (err) {
      const errorMessage = 'Erro na limpeza automática';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const cleanAllSchedulings = async (): Promise<number> => {
    try {
      setIsLoading(true);
      const result = await cleanAllSchedulingsService();
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = 'Erro na limpeza completa';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkDuplicateScheduling = async (email: string, date: Date): Promise<boolean> => {
    try {
      return await checkDuplicateSchedulingService(email, date);
    } catch (err) {
      console.warn('Erro ao verificar duplicata:', err);
      return false;
    }
  };

  const debugSchedulings = async (): Promise<void> => {
    try {
      await debugSchedulingsService();
    } catch (err) {
      const errorMessage = 'Erro no debug';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    schedulings,
    isLoading,
    error,
    addScheduling,
    removeScheduling,
    cleanOldSchedulings,
    cleanAllSchedulings,
    checkDuplicateScheduling,
    debugSchedulings
  };
};
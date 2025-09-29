import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface SchedulingData {
  id?: string;
  email: string;
  date: Date;
  dayOfWeek: string;
  location: 'berrine' | 'santana' | 'home-office';
  createdAt?: Date;
}

// Nome da coleção no Firestore
const COLLECTION_NAME = 'agendamentos';

/**
 * Adicionar um novo agendamento
 */
export const addScheduling = async (scheduling: Omit<SchedulingData, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...scheduling,
      date: Timestamp.fromDate(scheduling.date),
      createdAt: Timestamp.fromDate(new Date())
    });
    console.log('Agendamento salvo com ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar agendamento: ', error);
    throw error;
  }
};

/**
 * Buscar todos os agendamentos (uma vez)
 */
export const getAllSchedulings = async (): Promise<SchedulingData[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const schedulings: SchedulingData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      schedulings.push({
        id: doc.id,
        email: data.email,
        date: data.date.toDate(),
        dayOfWeek: data.dayOfWeek,
        location: data.location,
        createdAt: data.createdAt?.toDate()
      });
    });
    
    return schedulings;
  } catch (error) {
    console.error('Erro ao buscar agendamentos: ', error);
    throw error;
  }
};

/**
 * Escutar mudanças em tempo real
 */
export const listenToSchedulings = (callback: (schedulings: SchedulingData[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const schedulings: SchedulingData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      schedulings.push({
        id: doc.id,
        email: data.email,
        date: data.date.toDate(),
        dayOfWeek: data.dayOfWeek,
        location: data.location,
        createdAt: data.createdAt?.toDate()
      });
    });
    callback(schedulings);
  }, (error) => {
    console.error('Erro ao escutar mudanças: ', error);
  });
};

/**
 * Deletar um agendamento
 */
export const deleteScheduling = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log('Agendamento deletado com sucesso');
  } catch (error) {
    console.error('Erro ao deletar agendamento: ', error);
    throw error;
  }
};

/**
 * Buscar agendamentos por período (para relatórios)
 */
export const getSchedulingsByDateRange = async (startDate: Date, endDate: Date): Promise<SchedulingData[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const schedulings: SchedulingData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const schedulingDate = data.date.toDate();
      
      // Filtrar por período
      if (schedulingDate >= startDate && schedulingDate <= endDate) {
        schedulings.push({
          id: doc.id,
          email: data.email,
          date: schedulingDate,
          dayOfWeek: data.dayOfWeek,
          location: data.location,
          createdAt: data.createdAt?.toDate()
        });
      }
    });
    
    return schedulings;
  } catch (error) {
    console.error('Erro ao buscar agendamentos por período: ', error);
    throw error;
  }
};

/**
 * Limpar agendamentos com mais de 2 dias (para evitar duplicatas no BI)
 */
export const cleanOldSchedulings = async (): Promise<number> => {
  try {
    // Data limite: 2 dias atrás (baseado na data do agendamento, não na data de criação)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(23, 59, 59, 999); // Final do dia de 2 dias atrás
    
    console.log('Limpando agendamentos para datas até:', twoDaysAgo.toLocaleDateString('pt-BR'));
    
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    
    const deletePromises: Promise<void>[] = [];
    let deletedCount = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      const schedulingDate = data.date.toDate();
      const createdDate = data.createdAt ? data.createdAt.toDate() : data.date.toDate();
      
      // Se o agendamento é para uma data de 2 dias atrás ou anterior, deletar
      if (schedulingDate <= twoDaysAgo) {
        deletePromises.push(deleteDoc(doc.ref));
        deletedCount++;
        console.log(`Marcando para deletar: ${data.email} - Agendado para: ${schedulingDate.toLocaleDateString('pt-BR')} - Criado em: ${createdDate.toLocaleDateString('pt-BR')}`);
      } else {
        console.log(`Mantendo: ${data.email} - Agendado para: ${schedulingDate.toLocaleDateString('pt-BR')} - Criado em: ${createdDate.toLocaleDateString('pt-BR')}`);
      }
    });
    
    // Executar todas as deleções em paralelo
    await Promise.all(deletePromises);
    
    if (deletedCount === 0) {
      console.log('Nenhum agendamento antigo encontrado para remover.');
    } else {
      console.log(`Limpeza concluída: ${deletedCount} agendamentos removidos`);
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Erro ao limpar agendamentos antigos: ', error);
    throw error;
  }
};

/**
 * Limpeza manual COMPLETA - Admin pode deletar TODOS os agendamentos
 */
export const cleanAllSchedulings = async (): Promise<number> => {
  try {
    console.log('Limpeza manual - Removendo TODOS os agendamentos...');
    
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    
    const deletePromises: Promise<void>[] = [];
    let deletedCount = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const schedulingDate = data.date.toDate();
      
      deletePromises.push(deleteDoc(doc.ref));
      deletedCount++;
      console.log(`Removendo: ${data.email} - Agendado para: ${schedulingDate.toLocaleDateString('pt-BR')}`);
    });
    
    // Executar todas as deleções em paralelo
    await Promise.all(deletePromises);
    
    console.log(`Limpeza manual concluída: ${deletedCount} agendamentos removidos`);
    return deletedCount;
  } catch (error) {
    console.error('Erro na limpeza manual completa:', error);
    throw error;
  }
};

/**
 * Verificar se já existe agendamento para email + data (prevenir duplicatas)
 */
export const checkDuplicateScheduling = async (email: string, date: Date): Promise<boolean> => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    
    let hasDuplicate = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const schedulingDate = data.date.toDate();
      
      // Comparar email e data (mesmo dia)
      if (data.email === email && 
          schedulingDate.toDateString() === date.toDateString()) {
        hasDuplicate = true;
      }
    });
    
    return hasDuplicate;
  } catch (error) {
    console.error('Erro ao verificar duplicata: ', error);
    return false;
  }
};

/**
 * Função de debug para listar todos os agendamentos com suas datas
 */
export const debugSchedulings = async (): Promise<void> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log('=== DEBUG: Todos os agendamentos ===');
    console.log(`Total de agendamentos: ${querySnapshot.size}`);
    
    const now = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(0, 0, 0, 0);
    
    console.log(`Data atual: ${now.toLocaleString('pt-BR')}`);
    console.log(`Data limite (2 dias atrás): ${twoDaysAgo.toLocaleString('pt-BR')}`);
    console.log('---');
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const createdDate = data.createdAt ? data.createdAt.toDate() : data.date.toDate();
      const schedulingDate = data.date.toDate();
      const isOld = createdDate < twoDaysAgo;
      
      console.log(`ID: ${doc.id}`);
      console.log(`Email: ${data.email}`);
      console.log(`Agendado para: ${schedulingDate.toLocaleString('pt-BR')}`);
      console.log(`Criado em: ${createdDate.toLocaleString('pt-BR')}`);
      console.log(`É antigo (>2 dias): ${isOld ? 'SIM' : 'NÃO'}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Erro no debug: ', error);
  }
};
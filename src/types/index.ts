// Types and interfaces for the scheduling system

export interface SchedulingData {
  id?: string;
  email: string;
  date: Date;
  dayOfWeek: string;
  location: 'berrine' | 'santana' | 'home-office';
  createdAt?: Date;
}

export interface FormData {
  email: string;
  location: 'berrine' | 'santana' | 'home-office';
}

export interface LoginData {
  username: string;
  password: string;
}

export type LocationType = 'berrine' | 'santana' | 'home-office';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
}

export interface ExportOptions {
  format: 'excel' | 'csv';
  filename?: string;
}

// Hook types
export interface UseSchedulingsReturn {
  schedulings: SchedulingData[];
  isLoading: boolean;
  error: string | null;
  addScheduling: (data: Omit<SchedulingData, 'id' | 'createdAt'>) => Promise<void>;
  removeScheduling: (id: string) => Promise<void>;
  cleanOldSchedulings: () => Promise<number>;
  cleanAllSchedulings: () => Promise<number>;
  checkDuplicateScheduling: (email: string, date: Date) => Promise<boolean>;
  debugSchedulings: () => Promise<void>;
}

export interface UseAuthReturn {
  isAuthenticated: boolean;
  login: (credentials: LoginData) => boolean;
  logout: () => void;
  loginError: string;
}

export interface UseConnectionReturn {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
}
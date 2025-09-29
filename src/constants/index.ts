// Constants and configuration for the scheduling system

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'presença@mast'
} as const;

export const LOCATION_LABELS = {
  'berrine': 'Berrine',
  'santana': 'Santana',
  'home-office': 'Home Office'
} as const;

export const LOCATION_OPTIONS = [
  { value: 'berrine', label: 'Berrine', icon: '🏬' },
  { value: 'santana', label: 'Santana', icon: '🏢' },
  { value: 'home-office', label: 'Home Office', icon: '🏠' }
] as const;

export const WEEK_DAYS = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
  'Quinta-feira', 'Sexta-feira', 'Sábado'
] as const;

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
] as const;

export const CALENDAR_WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

export const EMAIL_DOMAIN = '@grupomast.com.br';

export const MAX_FUTURE_DAYS = 30;

export const EXPORT_FILENAME_PREFIX = 'agendamentos';

export const FIREBASE_COLLECTION = 'agendamentos';

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email é obrigatório',
  EMAIL_INVALID_DOMAIN: 'Email deve terminar com @grupomast.com.br',
  LOCATION_REQUIRED: 'Local é obrigatório',
  DATE_REQUIRED: 'Por favor, selecione uma data no calendário',
  LOGIN_INVALID: 'Credenciais inválidas. Apenas administradores podem exportar dados.',
  USERNAME_REQUIRED: 'Usuário é obrigatório',
  PASSWORD_REQUIRED: 'Senha é obrigatória'
} as const;

export const SUCCESS_MESSAGES = {
  SCHEDULING_ADDED: '✅ Agendamento adicionado com sucesso!',
  CLEANUP_COMPLETED: '✅ Limpeza completa realizada!',
  DEBUG_COMPLETED: '✅ Debug concluído! Verifique o console (F12) para ver todos os dados detalhados.',
  AUTO_CLEANUP: '✅ Limpeza automática: {count} agendamentos antigos removidos'
} as const;

export const ERROR_MESSAGES = {
  SCHEDULING_ERROR: '❌ Erro ao adicionar agendamento. Tente novamente.',
  REMOVE_ERROR: 'Erro ao remover agendamento. Tente novamente.',
  CLEANUP_ERROR: '❌ Erro ao executar limpeza. Tente novamente.',
  DEBUG_ERROR: '❌ Erro no debug. Verifique o console.',
  NO_SCHEDULINGS: 'Não há agendamentos para exportar',
  DUPLICATE_SCHEDULING: '⚠️ Já existe um agendamento para {email} na data {date}.\n\nPara evitar duplicatas no BI, não é possível criar outro agendamento para a mesma data.',
  DATE_WEEKEND: 'Fins de semana não são permitidos para agendamento.',
  DATE_HOLIDAY: 'Feriados não são permitidos para agendamento.'
} as const;
// Lista de feriados brasileiros para 2025
export const holidays2025: string[] = [
  '2025-01-01', // Confraternização Universal
  '2025-02-24', // Carnaval (segunda-feira)
  '2025-02-25', // Carnaval (terça-feira)
  '2025-04-18', // Sexta-feira Santa
  '2025-04-21', // Tiradentes
  '2025-05-01', // Dia do Trabalhador
  '2025-06-19', // Corpus Christi
  '2025-09-07', // Independência do Brasil
  '2025-10-12', // Nossa Senhora Aparecida
  '2025-11-02', // Finados
  '2025-11-15', // Proclamação da República
  '2025-12-25', // Natal
];

// Função para verificar se uma data é feriado
export const isHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0];
  return holidays2025.includes(dateString);
};

// Função para verificar se uma data é fim de semana
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
};

// Função para verificar se uma data deve ser desabilitada
export const isDateDisabled = (date: Date): boolean => {
  return isWeekend(date) || isHoliday(date);
};

// Função para obter a classe CSS da data
export const getDateClassName = (date: Date): string => {
  if (isHoliday(date)) {
    return 'holiday-date';
  }
  if (isWeekend(date)) {
    return 'weekend-date';
  }
  return 'available-date'; // Classe para dias disponíveis
};

// Função para obter o tipo da data
export const getDateType = (date: Date): 'holiday' | 'weekend' | 'available' => {
  if (isHoliday(date)) {
    return 'holiday';
  }
  if (isWeekend(date)) {
    return 'weekend';
  }
  return 'available';
};
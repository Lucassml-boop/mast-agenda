import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isDateDisabled, getDateClassName, isDateTodayOrPast } from '../utils/dateUtils';

interface CustomCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateSelect
}) => {
  // Sempre iniciar no mês atual
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  // Array com nomes dos meses
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Array com nomes dos dias da semana (começando no domingo)
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Obter primeiro dia do mês atual
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Domingo, 1 = Segunda, etc.
  };

  // Obter número de dias no mês
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Obter número de dias no mês anterior
  const getDaysInPreviousMonth = (month: number, year: number) => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    return new Date(prevYear, prevMonth + 1, 0).getDate();
  };

  // Gerar array com todos os dias para exibir no calendário
  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInPreviousMonth(currentMonth, currentYear);
    
    const days = [];

    // Adicionar dias do mês anterior para preencher a primeira semana
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isPreviousMonth: true,
        isNextMonth: false
      });
    }

    // Adicionar dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isPreviousMonth: false,
        isNextMonth: false
      });
    }

    // Adicionar dias do próximo mês para completar a última semana
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    for (let i = days.length; i < totalCells; i++) {
      const date = new Date(currentMonth === 11 ? currentYear + 1 : currentYear, currentMonth === 11 ? 0 : currentMonth + 1, nextMonthDay);
      days.push({
        date,
        day: nextMonthDay,
        isCurrentMonth: false,
        isPreviousMonth: false,
        isNextMonth: true
      });
      nextMonthDay++;
    }

    return days;
  };

  // Navegar para o mês anterior
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navegar para o próximo mês
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Navegar para o mês de uma data específica
  const goToDateMonth = (date: Date) => {
    const targetMonth = date.getMonth();
    const targetYear = date.getFullYear();
    
    if (targetMonth !== currentMonth || targetYear !== currentYear) {
      setCurrentMonth(targetMonth);
      setCurrentYear(targetYear);
    }
  };

  // Verificar se a data está selecionada
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Verificar se a data está no passado ou é hoje (bloquear datas anteriores e incluindo hoje)
  const isDateInPastOrToday = (date: Date) => {
    return isDateTodayOrPast(date);
  };

  // Verificar se a data está muito longe no futuro (máximo 30 dias)
  const isDateTooFarInFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30); // 30 dias no futuro
    return compareDate > maxDate;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="custom-calendar bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
      {/* Header com navegação */}
      <div className="calendar-header bg-gradient-to-r from-blue-600 to-blue-800 p-2 sm:p-3 md:p-4 flex items-center justify-between shadow-lg">
        <button
          onClick={goToPreviousMonth}
          className="p-2 sm:p-3 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 shadow-md"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </button>
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg tracking-wide">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 sm:p-3 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110 shadow-md"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="weekdays-header bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 sm:p-3 md:p-4 text-center text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Grid de dias */}
      <div className="calendar-grid p-1 sm:p-2 md:p-3">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((dayObj, index) => {
            const { date, day, isCurrentMonth } = dayObj;
            const isDisabledByRule = isDateDisabled(date); // fins de semana ou feriados
            const isPastOrTodayDate = isDateInPastOrToday(date); // incluindo hoje
            const isTooFarInFuture = isDateTooFarInFuture(date);
            // Permitir seleção de datas de outros meses se estiverem visíveis e válidas
            const disabled = isDisabledByRule || isPastOrTodayDate || isTooFarInFuture;
            const selected = isDateSelected(date);
            const dateClassName = getDateClassName(date);

            return (
              <button
                key={`${date.getFullYear()}-${date.getMonth()}-${day}-${index}`}
                onClick={() => {
                  if (!disabled) {
                    // Se a data é de outro mês, navegar para esse mês primeiro
                    if (!isCurrentMonth) {
                      goToDateMonth(date);
                    }
                    onDateSelect(date);
                  }
                }}
                disabled={disabled}
                className={`
                  calendar-day aspect-square p-1 sm:p-2 md:p-3 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300
                  flex items-center justify-center min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] relative shadow-sm
                  ${!isCurrentMonth 
                    ? disabled
                      ? 'text-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
                      : 'text-gray-500 bg-white/70 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
                    : disabled
                      ? 'cursor-not-allowed opacity-60'
                      : 'text-white cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 shadow-md hover:shadow-lg hover:scale-105'
                  }
                  ${selected 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl scale-110 ring-4 ring-white border-2 border-white' 
                    : ''
                  }
                  ${isDisabledByRule 
                    ? dateClassName === 'weekend-date' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                    : ''
                  }
                  ${isPastOrTodayDate && !isDisabledByRule
                    ? 'bg-gray-100 text-gray-400 shadow-inner cursor-not-allowed'
                    : ''
                  }
                `}
              >
                {day}
                
                {/* Indicadores visuais */}
                {isDisabledByRule && dateClassName === 'weekend-date' && (
                  <span className="absolute top-1 right-1 text-xs opacity-90">×</span>
                )}
                {isDisabledByRule && dateClassName === 'holiday-date' && (
                  <span className="absolute top-1 right-1 text-xs text-yellow-300">★</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
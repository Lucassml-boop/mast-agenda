import React, { useState } from 'react';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import CustomCalendar from './CustomCalendar';
import CalendarLegend from './CalendarLegend';
import SchedulingForm from './SchedulingForm';
import SchedulingList from './SchedulingList';
import LoginModal from './LoginModal';
import Header from './Header';
import { isDateDisabled } from '../utils/dateUtils';
import { useSchedulings, useAuth, useConnection, useExcelExport } from '../hooks';
import type { FormData } from '../types';
import { WEEK_DAYS, SUCCESS_MESSAGES, ERROR_MESSAGES, VALIDATION_MESSAGES } from '../constants';

const SchedulingSystem: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dateError, setDateError] = useState('');

  // Custom hooks
  const { 
    schedulings, 
    isLoading, 
    addScheduling, 
    removeScheduling, 
    cleanAllSchedulings,
    checkDuplicateScheduling,
    debugSchedulings 
  } = useSchedulings();
  
  const { isAuthenticated, login, logout, loginError } = useAuth();
  const { isConnected } = useConnection();
  const { exportToExcel } = useExcelExport();

  const getDayOfWeek = (date: Date): string => {
    return WEEK_DAYS[date.getDay()];
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedDate) {
      alert(VALIDATION_MESSAGES.DATE_REQUIRED);
      return;
    }

    try {
      // Verificar se já existe agendamento para este email + data
      const hasDuplicate = await checkDuplicateScheduling(data.email, selectedDate);
      if (hasDuplicate) {
        alert(ERROR_MESSAGES.DUPLICATE_SCHEDULING
          .replace('{email}', data.email)
          .replace('{date}', selectedDate.toLocaleDateString('pt-BR'))
        );
        return;
      }
      
      const newScheduling = {
        email: data.email,
        date: selectedDate,
        dayOfWeek: getDayOfWeek(selectedDate),
        location: data.location,
      };

      await addScheduling(newScheduling);
      setSelectedDate(null);
      alert(SUCCESS_MESSAGES.SCHEDULING_ADDED);
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      alert(ERROR_MESSAGES.SCHEDULING_ERROR);
    }
  };

  const handleExportClick = () => {
    if (schedulings.length === 0) {
      alert(ERROR_MESSAGES.NO_SCHEDULINGS);
      return;
    }
    
    if (isAuthenticated) {
      exportToExcel(schedulings);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (loginData: { username: string; password: string }) => {
    const success = login(loginData);
    if (success) {
      setShowLoginModal(false);
      exportToExcel(schedulings);
    }
    return success;
  };

  const handleManualCleanup = async () => {
    if (!isAuthenticated) {
      alert('❌ Apenas administradores podem executar limpeza de dados.');
      return;
    }

    const confirmCleanup = window.confirm(
      '🗑️ LIMPEZA COMPLETA\n\n' +
      '⚠️ ATENÇÃO: Esta ação irá remover TODOS os agendamentos,\n' +
      'incluindo os futuros!\n\n' +
      'Use apenas se necessário para resetar o sistema.\n\n' +
      'Deseja continuar?'
    );

    if (!confirmCleanup) return;

    try {
      const deletedCount = await cleanAllSchedulings();
      alert(`✅ Limpeza completa realizada!\n\n${deletedCount} agendamentos removidos.`);
    } catch (error) {
      console.error('Erro na limpeza manual:', error);
      alert('❌ Erro ao executar limpeza. Tente novamente.');
    }
  };

  const handleDebug = async () => {
    if (!isAuthenticated) {
      alert('❌ Apenas administradores podem ver os dados de debug.');
      return;
    }

    try {
      await debugSchedulings();
      alert(SUCCESS_MESSAGES.DEBUG_COMPLETED);
    } catch (error) {
      console.error('Erro no debug:', error);
      alert('❌ Erro no debug. Verifique o console.');
    }
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        setDateError(ERROR_MESSAGES.DATE_WEEKEND);
      } else {
        setDateError(ERROR_MESSAGES.DATE_HOLIDAY);
      }
      setTimeout(() => setDateError(''), 3000);
    } else {
      setSelectedDate(date);
      setDateError('');
    }
  };

  const handleRemoveScheduling = async (id: string) => {
    try {
      await removeScheduling(id);
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      alert(ERROR_MESSAGES.REMOVE_ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header
          isConnected={isConnected}
          isAuthenticated={isAuthenticated}
          onManualCleanup={handleManualCleanup}
          onDebug={handleDebug}
          onLogout={logout}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Lado esquerdo - Formulário e Calendário */}
          <div className="space-y-6 lg:space-y-8">
            {/* Calendário */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 animate-in slide-in-from-left duration-500">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg">
                  <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                Selecione a Data
              </h2>
              
              <CalendarLegend />
              
              <CustomCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
              
              {/* Mensagem de erro para datas inválidas */}
              {dateError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-300">
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <p className="text-red-700 text-sm font-medium">{dateError}</p>
                  </div>
                </div>
              )}
              
              {selectedDate && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-lg animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-green-800 font-semibold text-sm sm:text-base">
                      Data selecionada: {selectedDate.toLocaleDateString('pt-BR')} ({getDayOfWeek(selectedDate)})
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Formulário */}
            <SchedulingForm
              selectedDate={selectedDate}
              isLoading={isLoading}
              isConnected={isConnected}
              onSubmit={onSubmit}
            />
          </div>

          {/* Lado direito - Lista de Agendamentos */}
          <div className="space-y-6 lg:space-y-8">
            <SchedulingList
              schedulings={schedulings}
              isLoading={isLoading}
              onRemoveScheduling={handleRemoveScheduling}
              onExportClick={handleExportClick}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>

      {/* Modal de Login do Admin */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
        loginError={loginError}
      />
    </div>
  );
};

export default SchedulingSystem;
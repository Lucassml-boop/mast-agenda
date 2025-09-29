import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Download, Calendar as CalendarIcon, MapPin, Mail, Lock, X, Eye, EyeOff, Wifi, WifiOff, XCircle, PartyPopper, Check, AlertTriangle, Trash2 } from 'lucide-react';
import ExcelJS from 'exceljs';
import CustomCalendar from './CustomCalendar';
import { isDateDisabled } from '../utils/dateUtils';
import { 
  addScheduling, 
  deleteScheduling, 
  listenToSchedulings,
  cleanOldSchedulings,
  cleanAllSchedulings,
  checkDuplicateScheduling,
  debugSchedulings,
  type SchedulingData
} from '../firebase/schedulingService';

// Using SchedulingData from Firebase service

interface FormData {
  email: string;
  location: 'berrine' | 'santana' | 'home-office';
}

interface LoginData {
  username: string;
  password: string;
}

const SchedulingSystem: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [schedulings, setSchedulings] = useState<SchedulingData[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [dateError, setDateError] = useState('');


  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginData>();

  const getDayOfWeek = (date: Date): string => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[date.getDay()];
  };

  const getLocationLabel = (location: string): string => {
    const labels = {
      'berrine': 'Berrine',
      'santana': 'Santana',
      'home-office': 'Home Office'
    };
    return labels[location as keyof typeof labels] || location;
  };

  // Conectar com Firebase ao inicializar
  useEffect(() => {
    setIsLoading(true);
    
    // Limpar dados antigos automaticamente
    const performCleanup = async () => {
      try {
        const deletedCount = await cleanOldSchedulings();
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
        setIsConnected(true);
      }
    );

    // Cleanup: parar de escutar quando componente for desmontado
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!selectedDate) {
      alert('Por favor, selecione uma data no calendário');
      return;
    }

    try {
      setIsLoading(true);
      
      // Verificar se já existe agendamento para este email + data
      const hasDuplicate = await checkDuplicateScheduling(data.email, selectedDate);
      if (hasDuplicate) {
        alert(`⚠️ Já existe um agendamento para ${data.email} na data ${selectedDate.toLocaleDateString('pt-BR')}.\n\nPara evitar duplicatas no BI, não é possível criar outro agendamento para a mesma data.`);
        setIsLoading(false);
        return;
      }
      
      const newScheduling = {
        email: data.email,
        date: selectedDate,
        dayOfWeek: getDayOfWeek(selectedDate),
        location: data.location,
      };

      await addScheduling(newScheduling);
      reset();
      setSelectedDate(null);
      alert('✅ Agendamento adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      alert('❌ Erro ao adicionar agendamento. Tente novamente.');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = async () => {
    if (schedulings.length === 0) {
      alert('Não há agendamentos para exportar');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Agendamentos');

    // Definir cabeçalhos
    worksheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Data', key: 'date', width: 15 },
      { header: 'Dia da Semana', key: 'dayOfWeek', width: 15 },
      { header: 'Local', key: 'location', width: 15 },
    ];

    // Adicionar dados
    schedulings.forEach(scheduling => {
      worksheet.addRow({
        email: scheduling.email,
        date: scheduling.date.toLocaleDateString('pt-BR'),
        dayOfWeek: scheduling.dayOfWeek,
        location: getLocationLabel(scheduling.location),
      });
    });

    // Estilizar cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Gerar e baixar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agendamentos_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const removeScheduling = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      await deleteScheduling(id);
      // O listener irá atualizar automaticamente a lista
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      alert('Erro ao remover agendamento. Tente novamente.');
      setIsConnected(false);
    }
  };

  // Credenciais do admin
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'presença@mast'
  };

  const handleLogin = (data: LoginData) => {
    if (data.username === ADMIN_CREDENTIALS.username && data.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError('');
      resetLogin();
      // Procede com a exportação
      exportToExcel();
    } else {
      setLoginError('Credenciais inválidas. Apenas administradores podem exportar dados.');
    }
  };

  const handleExportClick = () => {
    if (schedulings.length === 0) {
      alert('Não há agendamentos para exportar');
      return;
    }
    
    if (isAuthenticated) {
      exportToExcel();
    } else {
      setShowLoginModal(true);
      setLoginError('');
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setLoginError('');
    resetLogin();
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
      setIsLoading(true);
      const deletedCount = await cleanAllSchedulings();
      
      alert(`✅ Limpeza completa realizada!\n\n${deletedCount} agendamentos removidos.`);
    } catch (error) {
      console.error('Erro na limpeza manual:', error);
      alert('❌ Erro ao executar limpeza. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para debug dos dados
  const handleDebug = async () => {
    if (!isAuthenticated) {
      alert('❌ Apenas administradores podem ver os dados de debug.');
      return;
    }

    try {
      await debugSchedulings();
      alert('✅ Debug concluído! Verifique o console (F12) para ver todos os dados detalhados.');
    } catch (error) {
      console.error('Erro no debug:', error);
      alert('❌ Erro no debug. Verifique o console.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-in fade-in duration-700">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
                Sistema de Agendamento
              </h1>
            </div>
            <div className="flex-1 flex justify-end items-start gap-2">
              {/* Indicador de Conexão */}
              <div className={`${isConnected ? 'bg-green-500/20 border-green-400/30' : 'bg-red-500/20 border-red-400/30'} backdrop-blur-sm border rounded-xl px-2 py-1 sm:px-3 sm:py-2`}>
                <div className={`flex items-center gap-2 ${isConnected ? 'text-green-100' : 'text-red-100'}`}>
                  {isConnected ? (
                    <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <WifiOff className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span className="text-xs font-semibold hidden sm:inline">
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Admin Status */}
              {isAuthenticated && (
                <div className="flex gap-2">
                  {/* Botão de Debug */}
                  <button
                    onClick={handleDebug}
                    className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl px-2 py-1 sm:px-3 sm:py-2 hover:bg-blue-500/30 transition-colors"
                    title="Ver dados detalhados no console"
                  >
                    <div className="flex items-center gap-1 text-blue-100">
                      <span className="text-xs sm:text-sm">🔍</span>
                      <span className="text-xs font-semibold hidden sm:inline">Debug</span>
                    </div>
                  </button>

                  {/* Botão de Limpeza COMPLETA */}
                  <button
                    onClick={handleManualCleanup}
                    disabled={isLoading}
                    className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl px-2 py-1 sm:px-3 sm:py-2 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    title="LIMPEZA COMPLETA - Remove TODOS os agendamentos"
                  >
                    <div className="flex items-center gap-1 text-red-100">
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs font-semibold hidden sm:inline">Limpar Tudo</span>
                    </div>
                  </button>

                  {/* Status Admin */}
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex items-center gap-2 text-green-100">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-semibold">Admin</span>
                      <button
                        onClick={() => setIsAuthenticated(false)}
                        className="ml-2 text-green-200 hover:text-white transition-colors"
                        title="Logout"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto drop-shadow-md">
            Gerencie seus agendamentos para Berrine, Santana ou Home Office de forma inteligente
          </p>
        </div>

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
              
              {/* Legenda do calendário */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm justify-center">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-700 font-medium">Fins de semana</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PartyPopper className="w-4 h-4 text-red-700" />
                    <span className="text-gray-700 font-medium">Feriados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 font-medium">Disponível</span>
                  </div>
                </div>
              </div>
              
              <CustomCalendar
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  if (isDateDisabled(date)) {
                    const day = date.getDay();
                    if (day === 0 || day === 6) {
                      setDateError('Fins de semana não são permitidos para agendamento.');
                    } else {
                      setDateError('Feriados não são permitidos para agendamento.');
                    }
                    setTimeout(() => setDateError(''), 3000);
                  } else {
                    setSelectedDate(date);
                    setDateError('');
                  }
                }}
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
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 animate-in slide-in-from-left duration-700">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                Dados do Agendamento
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Corporativo *
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /@grupomast\.com\.br$/,
                        message: 'Email deve terminar com @grupomast.com.br'
                      }
                    })}
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base text-gray-900 bg-white shadow-sm hover:shadow-md"
                    placeholder="seu.nome@grupomast.com.br"
                  />
                  {errors.email && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
                    </div>
                  )}
                </div>

                {/* Local */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Local de Trabalho *
                  </label>
                  <select
                    {...register('location', { required: 'Local é obrigatório' })}
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base text-gray-900 bg-white shadow-sm hover:shadow-md"
                  >
                    <option value="">Selecione o local</option>
                    <option value="berrine">🏢 Berrine</option>
                    <option value="santana">🏢 Santana</option>
                    <option value="home-office">🏠 Home Office</option>
                  </select>
                  {errors.location && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">{errors.location.message}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isConnected}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 sm:py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : !isConnected ? (
                    <>
                      <WifiOff className="w-4 h-4" />
                      Sem Conexão
                    </>
                  ) : (
                    <>
                      ✨ Adicionar Agendamento
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Lado direito - Lista de Agendamentos */}
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 animate-in slide-in-from-right duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg">
                    <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  Agendamentos ({schedulings.length})
                </h2>
                <button
                  onClick={handleExportClick}
                  disabled={schedulings.length === 0}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  {isAuthenticated ? 'Exportar Excel' : '🔒 Exportar Excel (Admin)'}
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="mb-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Carregando agendamentos...</h3>
                  <p className="text-sm sm:text-base text-gray-500">
                    Conectando com o Firebase
                  </p>
                </div>
              ) : schedulings.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="mb-4">
                    <CalendarIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Nenhum agendamento cadastrado</h3>
                  <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto">
                    Selecione uma data no calendário e preencha o formulário para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 max-h-96 sm:max-h-[500px] overflow-y-auto pr-2">
                  {schedulings.map((scheduling, index) => (
                    <div
                      key={scheduling.id}  
                      className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 transform animate-in fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm sm:text-base truncate">
                              {scheduling.email}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3 h-3 text-blue-500 flex-shrink-0" />
                              <span>{scheduling.date.toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-amber-500 flex-shrink-0">📅</span>
                              <span>{scheduling.dayOfWeek}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span>{getLocationLabel(scheduling.location)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeScheduling(scheduling.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 transform"
                          title="Remover agendamento"
                        >
                          <span className="text-lg">✕</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Login do Admin */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                Login Administrativo
              </h3>
              <button
                onClick={closeLoginModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-sm font-medium">
                🔒 Apenas administradores podem exportar dados para Excel
              </p>
            </div>

            <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuário *
                </label>
                <input
                  type="text"
                  {...registerLogin('username', { required: 'Usuário é obrigatório' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 bg-white"
                  placeholder="Digite o usuário"
                />
                {loginErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerLogin('password', { required: 'Senha é obrigatória' })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 bg-white"
                    placeholder="Digite a senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                )}
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{loginError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeLoginModal}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Entrar
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Entre em contato com o administrador do sistema para obter as credenciais
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingSystem;
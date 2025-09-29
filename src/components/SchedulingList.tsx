import React from 'react';
import { CalendarIcon, Download } from 'lucide-react';
import type { SchedulingData } from '../types';
import SchedulingItem from './SchedulingItem';

interface SchedulingListProps {
  schedulings: SchedulingData[];
  isLoading: boolean;
  onRemoveScheduling: (id: string) => void;
  onExportClick: () => void;
  isAuthenticated: boolean;
}

const SchedulingList: React.FC<SchedulingListProps> = ({
  schedulings,
  isLoading,
  onRemoveScheduling,
  onExportClick,
  isAuthenticated
}) => {
  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 animate-in slide-in-from-right duration-500">
        <div className="text-center py-8 sm:py-12">
          <div className="mb-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Carregando agendamentos...</h3>
          <p className="text-sm sm:text-base text-gray-500">
            Conectando com o Firebase
          </p>
        </div>
      </div>
    );
  }

  if (schedulings.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 animate-in slide-in-from-right duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            Agendamentos (0)
          </h2>
        </div>
        <div className="text-center py-8 sm:py-12">
          <div className="mb-4">
            <CalendarIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Nenhum agendamento cadastrado</h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto">
            Selecione uma data no calendário e preencha o formulário para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3 text-gray-800">
          <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </div>
          Agendamentos ({schedulings.length})
        </h2>
        <button
          onClick={onExportClick}
          disabled={schedulings.length === 0}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-2 sm:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform w-full sm:w-auto"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span className="hidden xs:inline">{isAuthenticated ? 'Exportar Excel' : '🔒 Exportar (Admin)'}</span>
          <span className="xs:hidden">{isAuthenticated ? 'Excel' : '🔒 Excel'}</span>
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4 max-h-96 sm:max-h-[500px] overflow-y-auto pr-2">
        {schedulings.map((scheduling, index) => (
          <SchedulingItem
            key={scheduling.id || `${scheduling.email}-${scheduling.date.getTime()}`}
            scheduling={scheduling}
            index={index}
            onRemove={onRemoveScheduling}
          />
        ))}
      </div>
    </div>
  );
};

export default SchedulingList;
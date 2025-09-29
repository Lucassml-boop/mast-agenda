import React from 'react';

const CalendarLegend: React.FC = () => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
      <div className="flex flex-wrap gap-4 text-xs sm:text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded shadow-sm"></div>
          <span className="text-blue-800 font-medium">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded shadow-sm flex items-center justify-center">
            <span className="text-white text-xs">×</span>
          </div>
          <span className="text-blue-800 font-medium">Fim de semana</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-red-600 to-red-700 rounded shadow-sm flex items-center justify-center">
            <span className="text-yellow-300 text-xs">★</span>
          </div>
          <span className="text-blue-800 font-medium">Feriado</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend;
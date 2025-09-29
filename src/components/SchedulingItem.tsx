import React from 'react';
import { CalendarIcon, MapPin, Mail } from 'lucide-react';
import type { SchedulingData } from '../types';
import { LOCATION_LABELS } from '../constants';

interface SchedulingItemProps {
  scheduling: SchedulingData;
  index: number;
  onRemove: (id: string) => void;
}

const SchedulingItem: React.FC<SchedulingItemProps> = ({ 
  scheduling, 
  index, 
  onRemove 
}) => {
  const getLocationLabel = (location: string) => {
    return LOCATION_LABELS[location as keyof typeof LOCATION_LABELS] || location;
  };

  const handleRemove = () => {
    if (scheduling.id) {
      onRemove(scheduling.id);
    }
  };

  return (
    <div
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
          onClick={handleRemove}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 transform"
          title="Remover agendamento"
        >
          <span className="text-lg">✕</span>
        </button>
      </div>
    </div>
  );
};

export default SchedulingItem;
import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, MapPin } from 'lucide-react';
import type { FormData } from '../types';
import { LOCATION_OPTIONS, VALIDATION_MESSAGES } from '../constants';

interface SchedulingFormProps {
  selectedDate: Date | null;
  isLoading: boolean;
  isConnected: boolean;
  onSubmit: (data: FormData) => Promise<void>;
}

const SchedulingForm: React.FC<SchedulingFormProps> = ({
  selectedDate,
  isLoading,
  isConnected,
  onSubmit
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const handleFormSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20 animate-in slide-in-from-left duration-700">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-800">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        Dados do Agendamento
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-6">
        {/* Campo Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email corporativo *
          </label>
          <input
            type="email"
            {...register('email', {
              required: VALIDATION_MESSAGES.EMAIL_REQUIRED,
              pattern: {
                value: /@grupomast\.com\.br$/,
                message: VALIDATION_MESSAGES.EMAIL_INVALID_DOMAIN
              }
            })}
            className="w-full px-4 py-3 sm:px-5 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base text-gray-900 bg-white shadow-sm hover:shadow-md"
            placeholder="seu.nome@grupomast.com.br"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Campo Local */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Local de trabalho *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {LOCATION_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="relative flex items-center p-2 sm:p-3 md:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-md has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:shadow-lg has-[:checked]:ring-2 has-[:checked]:ring-blue-200"
              >
                <input
                  type="radio"
                  {...register('location', { required: VALIDATION_MESSAGES.LOCATION_REQUIRED })}
                  value={option.value}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  <span className="text-lg sm:text-xl">{option.icon}</span>
                  <span className="font-medium text-sm sm:text-base text-gray-700 has-[:checked]:text-blue-700">{option.label}</span>
                </div>
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-auto has-[:checked]:text-blue-500 flex-shrink-0" />
              </label>
            ))}
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !isConnected || !selectedDate}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 sm:py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Agendando...
            </>
          ) : !selectedDate ? (
            'Selecione uma data primeiro'
          ) : !isConnected ? (
            'Sem conexão'
          ) : (
            'Confirmar Agendamento'
          )}
        </button>
      </form>
    </div>
  );
};

export default SchedulingForm;
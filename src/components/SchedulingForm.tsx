import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, MapPin } from 'lucide-react';

interface FormData {
  email: string;
  location: 'berrine' | 'santana' | 'home-office';
}

interface SchedulingFormProps {
  selectedDate: Date | null;
  isLoading: boolean;
  isConnected: boolean;
  onSubmit: (data: FormData) => void;
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

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
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
              required: 'Email é obrigatório',
              pattern: {
                value: /@grupomast\.com\.br$/,
                message: 'Use apenas email @grupomast.com.br'
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'berrine', label: 'Berrine', icon: '🏬' },
              { value: 'santana', label: 'Santana', icon: '🏢' },
              { value: 'home-office', label: 'Home Office', icon: '🏠' }
            ].map((option) => (
              <label
                key={option.value}
                className="relative flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-md"
              >
                <input
                  type="radio"
                  {...register('location', { required: 'Local é obrigatório' })}
                  value={option.value}
                  className="sr-only"
                />
                <div className="flex items-center gap-3 w-full">
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium text-gray-700">{option.label}</span>
                </div>
                <MapPin className="w-4 h-4 text-gray-400 ml-auto" />
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
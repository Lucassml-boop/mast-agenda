import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff } from 'lucide-react';
import type { LoginData } from '../types';
import { VALIDATION_MESSAGES } from '../constants';
import Modal from './ui/Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: LoginData) => boolean;
  loginError: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  loginError
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginData>();

  const handleFormSubmit = (data: LoginData) => {
    const success = onLogin(data);
    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Login Administrativo"
      icon={<Lock className="w-5 h-5 text-white" />}
    >
      <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl">
        <p className="text-amber-800 text-xs sm:text-sm font-medium">
          🔒 Apenas administradores podem exportar dados para Excel
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Usuário *
          </label>
          <input
            type="text"
            {...register('username', { required: VALIDATION_MESSAGES.USERNAME_REQUIRED })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-sm sm:text-base text-gray-900 bg-white"
            placeholder="Digite o usuário"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Senha *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: VALIDATION_MESSAGES.PASSWORD_REQUIRED })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-sm sm:text-base text-gray-900 bg-white"
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {loginError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{loginError}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Entrar
          </button>
        </div>
      </form>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Entre em contato com o administrador do sistema para obter as credenciais
        </p>
      </div>
    </Modal>
  );
};

export default LoginModal;
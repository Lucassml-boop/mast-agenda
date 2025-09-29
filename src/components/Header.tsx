import React from 'react';
import { Wifi, WifiOff, PartyPopper, Trash2, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  isAuthenticated: boolean;
  onManualCleanup: () => void;
  onDebug: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isConnected,
  isAuthenticated,
  onManualCleanup,
  onDebug
}) => {
  return (
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
          <div className={`${
            isConnected 
              ? 'bg-green-500/20 border-green-400/30' 
              : 'bg-red-500/20 border-red-400/30'
          } backdrop-blur-sm border rounded-xl px-2 py-1 sm:px-3 sm:py-2`}>
            <div className={`flex items-center gap-2 ${
              isConnected ? 'text-green-100' : 'text-red-100'
            }`}>
              {isConnected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span className="text-xs sm:text-sm font-medium">
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Admin Status */}
          {isAuthenticated && (
            <div className="flex gap-2">
              {/* Status Admin */}
              <div className="bg-emerald-500/20 border-emerald-400/30 backdrop-blur-sm border rounded-xl px-2 py-1 sm:px-3 sm:py-2">
                <div className="flex items-center gap-2 text-emerald-100">
                  <PartyPopper className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">Admin</span>
                </div>
              </div>

              {/* Botão Limpeza */}
              <button
                onClick={onManualCleanup}
                className="bg-red-500/20 hover:bg-red-500/30 border-red-400/30 backdrop-blur-sm border rounded-xl px-2 py-1 sm:px-3 sm:py-2 transition-colors"
                title="Limpeza completa dos dados"
              >
                <div className="flex items-center gap-2 text-red-100">
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Limpar</span>
                </div>
              </button>

              {/* Botão Debug */}
              <button
                onClick={onDebug}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-400/30 backdrop-blur-sm border rounded-xl px-2 py-1 sm:px-3 sm:py-2 transition-colors"
                title="Debug dos dados"
              >
                <div className="flex items-center gap-2 text-yellow-100">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Debug</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto drop-shadow-md">
        Gerencie seus agendamentos para Berrine, Santana ou Home Office de forma inteligente
      </p>
    </div>
  );
};

export default Header;
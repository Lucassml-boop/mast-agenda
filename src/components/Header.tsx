import React from 'react';
import ConnectionStatus from './ConnectionStatus';
import AdminPanel from './AdminPanel';

interface HeaderProps {
  isConnected: boolean;
  isAuthenticated: boolean;
  onManualCleanup: () => void;
  onDebug: () => void;
  onLogout: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isConnected,
  isAuthenticated,
  onManualCleanup,
  onDebug,
  onLogout,
  isLoading = false
}) => {
  return (
    <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4 gap-3 sm:gap-0">
        <div className="hidden sm:block sm:flex-1"></div>
        
        <div className="flex-1 sm:flex-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-lg leading-tight">
            Sistema de Agendamento
          </h1>
        </div>
        
        <div className="flex sm:flex-1 justify-center sm:justify-end items-center sm:items-start gap-1 sm:gap-2">
          <ConnectionStatus isConnected={isConnected} />
          <AdminPanel
            isAuthenticated={isAuthenticated}
            onManualCleanup={onManualCleanup}
            onDebug={onDebug}
            onLogout={onLogout}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto drop-shadow-md px-4 sm:px-0">
        Gerencie seus agendamentos para Berrine, Santana ou Home Office de forma inteligente
      </p>
    </div>
  );
};

export default Header;
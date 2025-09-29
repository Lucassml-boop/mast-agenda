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
    <div className="text-center mb-8 sm:mb-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1"></div>
        
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
            Sistema de Agendamento
          </h1>
        </div>
        
        <div className="flex-1 flex justify-end items-start gap-2">
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
      
      <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto drop-shadow-md">
        Gerencie seus agendamentos para Berrine, Santana ou Home Office de forma inteligente
      </p>
    </div>
  );
};

export default Header;
import React from 'react';
import { Trash2, AlertTriangle, X, PartyPopper } from 'lucide-react';

interface AdminPanelProps {
  isAuthenticated: boolean;
  onManualCleanup: () => void;
  onDebug: () => void;
  onLogout: () => void;
  isLoading?: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  isAuthenticated,
  onManualCleanup,
  onDebug,
  onLogout,
  isLoading = false
}) => {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex gap-1 sm:gap-2">
      {/* Botão de Debug */}
      <button
        onClick={onDebug}
        className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg sm:rounded-xl px-1.5 py-1 sm:px-3 sm:py-2 hover:bg-blue-500/30 transition-colors"
        title="Ver dados detalhados no console"
      >
        <div className="flex items-center gap-1 text-blue-100">
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs font-semibold hidden md:inline">Debug</span>
        </div>
      </button>

      {/* Botão de Limpeza COMPLETA */}
      <button
        onClick={onManualCleanup}
        disabled={isLoading}
        className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg sm:rounded-xl px-1.5 py-1 sm:px-3 sm:py-2 hover:bg-red-500/30 transition-colors disabled:opacity-50"
        title="LIMPEZA COMPLETA - Remove TODOS os agendamentos"
      >
        <div className="flex items-center gap-1 text-red-100">
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs font-semibold hidden md:inline">Limpar</span>
        </div>
      </button>

      {/* Status Admin */}
      <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg sm:rounded-xl px-2 py-1 sm:px-4 sm:py-2">
        <div className="flex items-center gap-1 sm:gap-2 text-green-100">
          <PartyPopper className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-semibold">Admin</span>
          <button
            onClick={onLogout}
            className="ml-1 sm:ml-2 text-green-200 hover:text-white transition-colors"
            title="Logout"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
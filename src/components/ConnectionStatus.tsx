import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <div className={`${
      isConnected 
        ? 'bg-green-500/20 border-green-400/30' 
        : 'bg-red-500/20 border-red-400/30'
    } backdrop-blur-sm border rounded-xl px-2 py-1 sm:px-3 sm:py-2`}>
      <div className={`flex items-center gap-2 ${
        isConnected ? 'text-green-100' : 'text-red-100'
      }`}>
        {isConnected ? (
          <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          <WifiOff className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
        <span className="text-xs font-semibold hidden sm:inline">
          {isConnected ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
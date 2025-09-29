import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  icon,
  maxWidth = 'md'
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 w-full ${maxWidthClasses[maxWidth]} shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-start sm:items-center gap-2 sm:gap-3 flex-1 pr-2">
            {icon && (
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex-shrink-0">
                {icon}
              </div>
            )}
            <span className="leading-tight">{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
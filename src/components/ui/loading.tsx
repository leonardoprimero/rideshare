// Componente de Loading/Spinner
import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', className, text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Componente de loading overlay para páginas completas
export const LoadingOverlay: React.FC<{ isLoading: boolean; text?: string }> = ({ 
  isLoading, 
  text = 'Cargando...' 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <Loading size="lg" text={text} />
      </div>
    </div>
  );
};

// Componente de loading inline para secciones
export const LoadingInline: React.FC<{ isLoading: boolean; text?: string; className?: string }> = ({ 
  isLoading, 
  text = 'Cargando...', 
  className 
}) => {
  if (!isLoading) return null;

  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <Loading size="md" text={text} />
    </div>
  );
};

export default Loading;

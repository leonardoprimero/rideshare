// Componente de EmptyState para mostrar cuando no hay datos
import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-4',
      className
    )}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Variantes predefinidas para casos comunes
export const EmptyRides: React.FC<{ onCreateRide?: () => void }> = ({ onCreateRide }) => (
  <EmptyState
    title="No tienes viajes"
    description="Cuando solicites un viaje, aparecerá aquí."
    icon={
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    }
    action={onCreateRide ? {
      label: "Solicitar viaje",
      onClick: onCreateRide
    } : undefined}
  />
);

export const EmptyDrivers: React.FC = () => (
  <EmptyState
    title="No hay conductores cerca"
    description="No encontramos conductores disponibles en tu área. Intenta en unos minutos."
    icon={
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    }
  />
);

export const EmptySharedRides: React.FC<{ onCreateRide?: () => void }> = ({ onCreateRide }) => (
  <EmptyState
    title="No hay viajes compartidos"
    description="No encontramos viajes compartidos disponibles para tu ruta."
    icon={
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
    action={onCreateRide ? {
      label: "Crear viaje compartido",
      onClick: onCreateRide
    } : undefined}
  />
);

export const EmptySearch: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => (
  <EmptyState
    title={searchTerm ? `No encontramos "${searchTerm}"` : "No hay resultados"}
    description="Intenta con otros términos de búsqueda o revisa la ortografía."
    icon={
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
  />
);

export default EmptyState;

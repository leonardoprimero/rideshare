// Componente de tracking en tiempo real para ShareRide
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Location } from '../../types';
import { geolocationService } from '../../services/geolocationService';
import { saltaLocations } from '../../data/mockData';

export interface RideProgress {
  rideId: string;
  driverId: string;
  passengerId: string;
  origin: Location;
  destination: Location;
  currentLocation: Location;
  progress: number; // 0-1
  status: 'starting' | 'picking_up' | 'in_transit' | 'arriving' | 'completed';
  estimatedArrival: Date;
  distance: number;
  duration: number;
}

export interface RealTimeTrackerProps {
  rideId?: string;
  driverId?: string;
  isActive?: boolean;
  updateInterval?: number; // en milisegundos
  onLocationUpdate?: (location: Location, progress: number) => void;
  onStatusChange?: (status: RideProgress['status']) => void;
  onRideComplete?: (rideId: string) => void;
  simulateMovement?: boolean;
}

export interface DriverTrackingState {
  currentLocation: Location;
  isOnline: boolean;
  isMoving: boolean;
  speed: number; // km/h
  heading: number; // grados
  lastUpdate: Date;
  battery: number; // porcentaje
}

const RealTimeTracker: React.FC<RealTimeTrackerProps> = ({
  rideId,
  driverId,
  isActive = false,
  updateInterval = 3000,
  onLocationUpdate,
  onStatusChange,
  onRideComplete,
  simulateMovement = true
}) => {
  // Estado del tracking
  const [trackingState, setTrackingState] = useState<DriverTrackingState>({
    currentLocation: saltaLocations.plazaJulio, // Ubicación inicial por defecto
    isOnline: false,
    isMoving: false,
    speed: 0,
    heading: 0,
    lastUpdate: new Date(),
    battery: 100
  });

  const [rideProgress, setRideProgress] = useState<RideProgress | null>(null);
  
  // Referencias para intervals y timeouts
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationCancelRef = useRef<(() => void) | null>(null);

  // Inicializar tracking cuando se activa
  useEffect(() => {
    if (isActive && driverId) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isActive, driverId]);

  // Función para iniciar el tracking
  const startTracking = useCallback(() => {
    console.log('🚗 Iniciando tracking para conductor:', driverId);
    
    setTrackingState(prev => ({
      ...prev,
      isOnline: true,
      lastUpdate: new Date()
    }));

    // Inicializar ubicación
    initializeLocation();

    // Configurar interval para actualizaciones regulares
    trackingIntervalRef.current = setInterval(() => {
      updateDriverStatus();
    }, updateInterval);

  }, [driverId, updateInterval]);

  // Función para detener el tracking
  const stopTracking = useCallback(() => {
    console.log('🛑 Deteniendo tracking para conductor:', driverId);
    
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }

    if (simulationCancelRef.current) {
      simulationCancelRef.current();
      simulationCancelRef.current = null;
    }

    setTrackingState(prev => ({
      ...prev,
      isOnline: false,
      isMoving: false,
      speed: 0
    }));

  }, [driverId]);

  // Inicializar ubicación del conductor
  const initializeLocation = async () => {
    try {
      // En una app real, esto vendría del GPS del conductor
      const location = await geolocationService.getLocationOrDefault();
      
      setTrackingState(prev => ({
        ...prev,
        currentLocation: location,
        lastUpdate: new Date()
      }));

      console.log('📍 Ubicación inicial del conductor:', location);
    } catch (error) {
      console.warn('⚠️ Error obteniendo ubicación inicial:', error);
      // Usar ubicación de Salta por defecto
      const locationKeys = Object.keys(saltaLocations);
      const randomKey = locationKeys[Math.floor(Math.random() * locationKeys.length)];
      const defaultLocation = saltaLocations[randomKey as keyof typeof saltaLocations];
      setTrackingState(prev => ({
        ...prev,
        currentLocation: defaultLocation,
        lastUpdate: new Date()
      }));
    }
  };

  // Actualizar estado del conductor
  const updateDriverStatus = () => {
    setTrackingState(prev => {
      const newState = { ...prev };
      
      // Simular cambios en batería
      newState.battery = Math.max(0, prev.battery - 0.1);
      
      // Actualizar timestamp
      newState.lastUpdate = new Date();
      
      // Si no hay viaje activo, simular movimiento aleatorio
      if (!rideProgress && simulateMovement) {
        simulateIdleMovement(newState);
      }
      
      return newState;
    });
  };

  // Simular movimiento cuando no hay viaje activo
  const simulateIdleMovement = (state: DriverTrackingState) => {
    // Movimiento aleatorio pequeño (como si el conductor estuviera esperando)
    const randomOffset = 0.001; // ~100 metros
    const randomLat = state.currentLocation.latitude + (Math.random() - 0.5) * randomOffset;
    const randomLng = state.currentLocation.longitude + (Math.random() - 0.5) * randomOffset;
    
    state.currentLocation = {
      latitude: randomLat,
      longitude: randomLng
    };
    
    state.speed = Math.random() * 5; // 0-5 km/h
    state.isMoving = state.speed > 1;
    state.heading = Math.random() * 360;
  };

  // Función interna para iniciar viaje con tracking de ruta (para uso futuro)
  const startRideTracking = (
    origin: Location,
    destination: Location,
    passengerId: string,
    estimatedDuration: number = 15 // minutos
  ) => {
    const newRideProgress: RideProgress = {
      rideId: rideId || `ride_${Date.now()}`,
      driverId: driverId || 'unknown',
      passengerId,
      origin,
      destination,
      currentLocation: origin,
      progress: 0,
      status: 'starting',
      estimatedArrival: new Date(Date.now() + estimatedDuration * 60 * 1000),
      distance: geolocationService.calculateDistance(origin, destination),
      duration: estimatedDuration
    };

    setRideProgress(newRideProgress);
    
    // Cancelar simulación anterior si existe
    if (simulationCancelRef.current) {
      simulationCancelRef.current();
    }

    // Iniciar simulación de movimiento hacia el destino
    simulationCancelRef.current = geolocationService.simulateMovement(
      origin,
      destination,
      estimatedDuration * 60 * 1000, // convertir a milisegundos
      (location, progress) => {
        updateRideProgress(location, progress);
      }
    );

    console.log('🚀 Viaje iniciado:', newRideProgress);
    
    if (onStatusChange) {
      onStatusChange('starting');
    }
  };

  // Actualizar progreso del viaje
  const updateRideProgress = useCallback((location: Location, progress: number) => {
    setRideProgress(prev => {
      if (!prev) return null;

      const updatedProgress = { ...prev };
      updatedProgress.currentLocation = location;
      updatedProgress.progress = progress;

      // Actualizar estado basado en progreso
      if (progress < 0.1) {
        updatedProgress.status = 'starting';
      } else if (progress < 0.3) {
        updatedProgress.status = 'picking_up';
      } else if (progress < 0.9) {
        updatedProgress.status = 'in_transit';
      } else if (progress < 1) {
        updatedProgress.status = 'arriving';
      } else {
        updatedProgress.status = 'completed';
      }

      return updatedProgress;
    });

    // Actualizar ubicación del conductor
    setTrackingState(prev => ({
      ...prev,
      currentLocation: location,
      isMoving: true,
      speed: 25 + Math.random() * 15, // 25-40 km/h
      lastUpdate: new Date()
    }));

    // Callbacks
    if (onLocationUpdate) {
      onLocationUpdate(location, progress);
    }

    if (progress >= 1 && onRideComplete && rideId) {
      onRideComplete(rideId);
    }

  }, [onLocationUpdate, onRideComplete, rideId]);

  // Obtener información de estado actual para uso externo si se necesita
  const getTrackingInfo = () => {
    return {
      ...trackingState,
      rideProgress,
      isActiveRide: !!rideProgress && rideProgress.status !== 'completed'
    };
  };

  // Exponer funciones para uso futuro (evita warnings de TypeScript)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Referencias para evitar warnings - estas funciones están disponibles para uso futuro
      console.debug('Tracking functions available:', { startRideTracking, getTrackingInfo });
    }
  }, []);

  return (
    <div className="real-time-tracker">
      {/* Este componente no renderiza UI directa, sino que proporciona funcionalidad */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1000,
          maxWidth: '250px'
        }}>
          <div><strong>Tracking Debug</strong></div>
          <div>Conductor: {driverId}</div>
          <div>Online: {trackingState.isOnline ? '✅' : '❌'}</div>
          <div>Batería: {trackingState.battery.toFixed(1)}%</div>
          <div>Velocidad: {trackingState.speed.toFixed(1)} km/h</div>
          {rideProgress && (
            <>
              <div>Viaje: {rideProgress.status}</div>
              <div>Progreso: {(rideProgress.progress * 100).toFixed(1)}%</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Hook personalizado simplificado para usar el tracker
export const useRealTimeTracking = () => {
  const trackerRef = useRef<any>(null);

  return {
    trackerRef
  };
};

export default RealTimeTracker;

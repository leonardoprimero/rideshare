// Hook personalizado para Google Maps con funcionalidades avanzadas
import { useState, useEffect, useCallback, useRef } from 'react';
import { Location } from '../types';
import { geolocationService, GeolocationError } from '../services/geolocationService';
import { googleMapsService, RouteInfo } from '../services/googleMapsService';

export interface MapMarker {
  id: string;
  location: Location;
  type: 'user' | 'driver' | 'origin' | 'destination' | 'shared';
  label?: string;
  data?: any;
  animated?: boolean;
}

export interface UseGoogleMapsOptions {
  enableGeolocation?: boolean;
  trackUserLocation?: boolean;
  autoCenter?: boolean;
  enableRouting?: boolean;
}

export interface MapState {
  center: Location;
  zoom: number;
  userLocation: Location | null;
  markers: MapMarker[];
  currentRoute: RouteInfo | null;
  isLoading: boolean;
  error: string | null;
}

export const useGoogleMaps = (options: UseGoogleMapsOptions = {}) => {
  const {
    enableGeolocation = true,
    trackUserLocation = false,
    autoCenter = true,
    enableRouting = true
  } = options;

  // Estado del mapa
  const [mapState, setMapState] = useState<MapState>({
    center: {
      latitude: -24.7859, // Salta por defecto
      longitude: -65.4117
    },
    zoom: 14,
    userLocation: null,
    markers: [],
    currentRoute: null,
    isLoading: false,
    error: null
  });

  // Referencias para tracking
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationCancelRef = useRef<(() => void) | null>(null);

  // Inicializar geolocalización
  useEffect(() => {
    if (enableGeolocation) {
      initializeUserLocation();
    }

    return () => {
      // Cleanup
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      if (simulationCancelRef.current) {
        simulationCancelRef.current();
      }
      geolocationService.stopWatching();
    };
  }, [enableGeolocation]);

  const initializeUserLocation = async () => {
    setMapState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const location = await geolocationService.getLocationOrDefault();
      
      setMapState(prev => ({
        ...prev,
        userLocation: location,
        center: autoCenter ? location : prev.center,
        isLoading: false,
        markers: [
          ...prev.markers.filter(m => m.type !== 'user'),
          {
            id: 'user-location',
            location,
            type: 'user',
            label: 'Tu ubicación'
          }
        ]
      }));

      // Iniciar tracking si está habilitado
      if (trackUserLocation) {
        startLocationTracking();
      }

    } catch (error) {
      const geoError = error as GeolocationError;
      setMapState(prev => ({
        ...prev,
        error: geoError.message,
        isLoading: false
      }));
    }
  };

  const startLocationTracking = () => {
    geolocationService.startWatching(
      (location: Location) => {
        setMapState(prev => ({
          ...prev,
          userLocation: location,
          center: autoCenter ? location : prev.center,
          markers: prev.markers.map(marker =>
            marker.type === 'user'
              ? { ...marker, location }
              : marker
          )
        }));
      },
      (error: GeolocationError) => {
        console.warn('Error en tracking de ubicación:', error.message);
      }
    );
  };

  const stopLocationTracking = () => {
    geolocationService.stopWatching();
  };

  // Agregar marcador
  const addMarker = useCallback((marker: MapMarker) => {
    setMapState(prev => ({
      ...prev,
      markers: [...prev.markers.filter(m => m.id !== marker.id), marker]
    }));
  }, []);

  // Remover marcador
  const removeMarker = useCallback((markerId: string) => {
    setMapState(prev => ({
      ...prev,
      markers: prev.markers.filter(m => m.id !== markerId)
    }));
  }, []);

  // Actualizar marcador
  const updateMarker = useCallback((markerId: string, updates: Partial<MapMarker>) => {
    setMapState(prev => ({
      ...prev,
      markers: prev.markers.map(m =>
        m.id === markerId ? { ...m, ...updates } : m
      )
    }));
  }, []);

  // Limpiar todos los marcadores
  const clearMarkers = useCallback((type?: MapMarker['type']) => {
    setMapState(prev => ({
      ...prev,
      markers: type
        ? prev.markers.filter(m => m.type !== type)
        : prev.markers.filter(m => m.type === 'user') // Mantener solo ubicación de usuario
    }));
  }, []);

  // Calcular y mostrar ruta
  const calculateRoute = useCallback(async (origin: Location, destination: Location) => {
    if (!enableRouting) return null;

    setMapState(prev => ({ ...prev, isLoading: true }));

    try {
      const route = await googleMapsService.calculateRoute(origin, destination);
      
      // Agregar marcadores de origen y destino
      const routeMarkers: MapMarker[] = [
        {
          id: 'route-origin',
          location: origin,
          type: 'origin',
          label: 'Origen'
        },
        {
          id: 'route-destination',
          location: destination,
          type: 'destination',
          label: 'Destino'
        }
      ];

      // Calcular centro y zoom óptimo
      const allLocations = [origin, destination];
      const center = googleMapsService.calculateCenter(allLocations);
      const zoom = googleMapsService.calculateOptimalZoom(allLocations);

      setMapState(prev => ({
        ...prev,
        currentRoute: route,
        center,
        zoom,
        isLoading: false,
        markers: [
          ...prev.markers.filter(m => !['origin', 'destination'].includes(m.type)),
          ...routeMarkers
        ]
      }));

      return route;
    } catch (error) {
      setMapState(prev => ({
        ...prev,
        error: 'Error al calcular la ruta',
        isLoading: false
      }));
      return null;
    }
  }, [enableRouting]);

  // Centrar mapa en ubicaciones
  const centerOnLocations = useCallback((locations: Location[]) => {
    if (locations.length === 0) return;

    const center = googleMapsService.calculateCenter(locations);
    const zoom = googleMapsService.calculateOptimalZoom(locations);

    setMapState(prev => ({
      ...prev,
      center,
      zoom
    }));
  }, []);

  // Simular movimiento de conductor
  const simulateDriverMovement = useCallback((
    driverId: string,
    startLocation: Location,
    endLocation: Location,
    durationMs: number = 30000
  ) => {
    // Cancelar simulación anterior si existe
    if (simulationCancelRef.current) {
      simulationCancelRef.current();
    }

    const cancelSimulation = geolocationService.simulateMovement(
      startLocation,
      endLocation,
      durationMs,
      (location, progress) => {
        updateMarker(driverId, {
          location,
          data: { ...mapState.markers.find(m => m.id === driverId)?.data, progress }
        });
      }
    );

    simulationCancelRef.current = cancelSimulation;
    return cancelSimulation;
  }, [updateMarker, mapState.markers]);

  // Agregar múltiples conductores cercanos
  const addNearbyDrivers = useCallback((userLocation: Location, count: number = 5) => {
    const drivers: MapMarker[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generar ubicación aleatoria cerca del usuario (radio de ~2km)
      const randomOffset = 0.02; // Aproximadamente 2km
      const randomLat = userLocation.latitude + (Math.random() - 0.5) * randomOffset;
      const randomLng = userLocation.longitude + (Math.random() - 0.5) * randomOffset;
      
      drivers.push({
        id: `driver-${i}`,
        location: {
          latitude: randomLat,
          longitude: randomLng
        },
        type: 'driver',
        label: `Conductor ${i + 1}`,
        data: {
          rating: 4.5 + Math.random() * 0.5,
          eta: Math.round(2 + Math.random() * 8), // 2-10 minutos
          vehicle: ['Toyota Corolla', 'Honda Civic', 'Chevrolet Cruze'][Math.floor(Math.random() * 3)]
        }
      });
    }

    setMapState(prev => ({
      ...prev,
      markers: [
        ...prev.markers.filter(m => m.type !== 'driver'),
        ...drivers
      ]
    }));

    return drivers;
  }, []);

  // Obtener marcadores filtrados por tipo
  const getMarkersByType = useCallback((type: MapMarker['type']) => {
    return mapState.markers.filter(m => m.type === type);
  }, [mapState.markers]);

  // Obtener conductor más cercano
  const getNearestDriver = useCallback((location: Location) => {
    const drivers = getMarkersByType('driver');
    if (drivers.length === 0) return null;

    let nearest = drivers[0];
    let shortestDistance = geolocationService.calculateDistance(location, nearest.location);

    drivers.forEach(driver => {
      const distance = geolocationService.calculateDistance(location, driver.location);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearest = driver;
      }
    });

    return { driver: nearest, distance: shortestDistance };
  }, [getMarkersByType]);

  // Limpiar error
  const clearError = useCallback(() => {
    setMapState(prev => ({ ...prev, error: null }));
  }, []);

  // Resetear mapa
  const resetMap = useCallback(() => {
    setMapState(prev => ({
      ...prev,
      markers: prev.markers.filter(m => m.type === 'user'),
      currentRoute: null,
      error: null
    }));
  }, []);

  return {
    // Estado
    ...mapState,
    
    // Acciones básicas
    addMarker,
    removeMarker,
    updateMarker,
    clearMarkers,
    
    // Geolocalización
    initializeUserLocation,
    startLocationTracking,
    stopLocationTracking,
    
    // Rutas
    calculateRoute,
    centerOnLocations,
    
    // Simulación y tracking
    simulateDriverMovement,
    addNearbyDrivers,
    
    // Utilidades
    getMarkersByType,
    getNearestDriver,
    clearError,
    resetMap
  };
};

export default useGoogleMaps;

// Servicio avanzado de Google Maps para ShareRide
import { Location } from '../types';
import { MAP_CONFIG } from '../constants';

export interface RouteInfo {
  distance: number; // en kilómetros
  duration: number; // en minutos
  polyline: string;
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  startLocation: Location;
  endLocation: Location;
}

export interface MapBounds {
  northeast: Location;
  southwest: Location;
}

class GoogleMapsService {
  private directionsService: google.maps.DirectionsService | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeServices();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Verificar si Google Maps ya está cargado
      if (typeof google !== 'undefined' && google.maps) {
        this.directionsService = new google.maps.DirectionsService();
        this.isInitialized = true;
        console.log('✅ Google Maps Services inicializados');
      } else {
        console.log('⏳ Esperando a que Google Maps se cargue...');
        // Esperar a que Google Maps se cargue
        this.waitForGoogleMaps();
      }
    } catch (error) {
      console.error('❌ Error al inicializar Google Maps Services:', error);
    }
  }

  private waitForGoogleMaps(): void {
    const checkInterval = setInterval(() => {
      if (typeof google !== 'undefined' && google.maps) {
        this.directionsService = new google.maps.DirectionsService();
        this.isInitialized = true;
        clearInterval(checkInterval);
        console.log('✅ Google Maps Services inicializados (diferido)');
      }
    }, 500);

    // Timeout después de 10 segundos
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!this.isInitialized) {
        console.warn('⚠️ Timeout: Google Maps no se pudo inicializar');
      }
    }, 10000);
  }

  async calculateRoute(origin: Location, destination: Location): Promise<RouteInfo> {
    return new Promise((resolve) => {
      if (!this.isInitialized || !this.directionsService) {
        // Fallback: calcular ruta aproximada sin Google Maps API
        resolve(this.calculateFallbackRoute(origin, destination));
        return;
      }

      const request: google.maps.DirectionsRequest = {
        origin: { lat: origin.latitude, lng: origin.longitude },
        destination: { lat: destination.latitude, lng: destination.longitude },
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0];
          const leg = route.legs[0];

          const routeInfo: RouteInfo = {
            distance: leg.distance?.value ? leg.distance.value / 1000 : 0, // convertir a km
            duration: leg.duration?.value ? leg.duration.value / 60 : 0, // convertir a minutos
            polyline: route.overview_polyline,
            steps: leg.steps?.map(step => ({
              instruction: step.instructions || '',
              distance: step.distance?.value ? step.distance.value / 1000 : 0,
              duration: step.duration?.value ? step.duration.value / 60 : 0,
              startLocation: {
                latitude: step.start_location.lat(),
                longitude: step.start_location.lng()
              },
              endLocation: {
                latitude: step.end_location.lat(),
                longitude: step.end_location.lng()
              }
            })) || []
          };

          resolve(routeInfo);
        } else {
          console.warn('Error en DirectionsService:', status);
          // Fallback en caso de error
          resolve(this.calculateFallbackRoute(origin, destination));
        }
      });
    });
  }

  private calculateFallbackRoute(origin: Location, destination: Location): RouteInfo {
    // Cálculo aproximado cuando Google Maps API no está disponible
    const distance = this.calculateHaversineDistance(origin, destination);
    const estimatedDuration = distance * 2.5; // Aproximadamente 2.5 minutos por km en ciudad

    return {
      distance: distance,
      duration: estimatedDuration,
      polyline: '', // No podemos generar polyline sin la API
      steps: [
        {
          instruction: `Dirigirse hacia ${destination.latitude.toFixed(4)}, ${destination.longitude.toFixed(4)}`,
          distance: distance,
          duration: estimatedDuration,
          startLocation: origin,
          endLocation: destination
        }
      ]
    };
  }

  private calculateHaversineDistance(point1: Location, point2: Location): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLng = this.toRadians(point2.longitude - point1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.latitude)) * 
              Math.cos(this.toRadians(point2.latitude)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  calculateOptimalZoom(locations: Location[]): number {
    if (locations.length === 0) return MAP_CONFIG.defaultZoom;
    if (locations.length === 1) return MAP_CONFIG.defaultZoom;

    const bounds = this.calculateBounds(locations);
    const latRange = bounds.northeast.latitude - bounds.southwest.latitude;
    const lngRange = bounds.northeast.longitude - bounds.southwest.longitude;

    // Aproximación para calcular zoom óptimo
    const maxRange = Math.max(latRange, lngRange);
    
    if (maxRange > 0.1) return 10;
    if (maxRange > 0.05) return 12;
    if (maxRange > 0.02) return 14;
    if (maxRange > 0.01) return 15;
    if (maxRange > 0.005) return 16;
    return 17;
  }

  calculateBounds(locations: Location[]): MapBounds {
    if (locations.length === 0) {
      return {
        northeast: { latitude: MAP_CONFIG.initialRegion.latitude, longitude: MAP_CONFIG.initialRegion.longitude },
        southwest: { latitude: MAP_CONFIG.initialRegion.latitude, longitude: MAP_CONFIG.initialRegion.longitude }
      };
    }

    let minLat = locations[0].latitude;
    let maxLat = locations[0].latitude;
    let minLng = locations[0].longitude;
    let maxLng = locations[0].longitude;

    locations.forEach(location => {
      minLat = Math.min(minLat, location.latitude);
      maxLat = Math.max(maxLat, location.latitude);
      minLng = Math.min(minLng, location.longitude);
      maxLng = Math.max(maxLng, location.longitude);
    });

    // Agregar un pequeño padding
    const latPadding = (maxLat - minLat) * 0.1;
    const lngPadding = (maxLng - minLng) * 0.1;

    return {
      northeast: {
        latitude: maxLat + latPadding,
        longitude: maxLng + lngPadding
      },
      southwest: {
        latitude: minLat - latPadding,
        longitude: minLng - lngPadding
      }
    };
  }

  calculateCenter(locations: Location[]): Location {
    if (locations.length === 0) {
      return {
        latitude: MAP_CONFIG.initialRegion.latitude,
        longitude: MAP_CONFIG.initialRegion.longitude
      };
    }

    const totalLat = locations.reduce((sum, location) => sum + location.latitude, 0);
    const totalLng = locations.reduce((sum, location) => sum + location.longitude, 0);

    return {
      latitude: totalLat / locations.length,
      longitude: totalLng / locations.length
    };
  }

  // Simulador de movimiento realista para conductores
  generateRealisticPath(start: Location, end: Location, steps: number = 10): Location[] {
    const path: Location[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      
      // Interpolación con variación realista
      const latVariation = (Math.random() - 0.5) * 0.001; // Pequeña variación
      const lngVariation = (Math.random() - 0.5) * 0.001;
      
      const location: Location = {
        latitude: start.latitude + (end.latitude - start.latitude) * progress + latVariation,
        longitude: start.longitude + (end.longitude - start.longitude) * progress + lngVariation
      };
      
      path.push(location);
    }
    
    return path;
  }

  // Estimación de tiempo basada en condiciones de tráfico simuladas
  estimateTimeWithTraffic(baseTimeMinutes: number, hour: number = new Date().getHours()): number {
    let trafficMultiplier = 1.0;

    // Factores de tráfico por hora (simulado para Salta)
    if (hour >= 7 && hour <= 9) {
      trafficMultiplier = 1.4; // Hora pico mañana
    } else if (hour >= 17 && hour <= 19) {
      trafficMultiplier = 1.6; // Hora pico tarde
    } else if (hour >= 12 && hour <= 14) {
      trafficMultiplier = 1.2; // Hora almuerzo
    } else if (hour >= 22 || hour <= 6) {
      trafficMultiplier = 0.8; // Noche/madrugada
    }

    return Math.round(baseTimeMinutes * trafficMultiplier);
  }

  // Obtener direcciones paso a paso (simplificado)
  async getTurnByTurnDirections(origin: Location, destination: Location): Promise<string[]> {
    try {
      const route = await this.calculateRoute(origin, destination);
      return route.steps.map(step => step.instruction).filter(instruction => instruction.length > 0);
    } catch (error) {
      console.error('Error obteniendo direcciones:', error);
      return [
        'Dirigirse hacia el destino',
        `Distancia aproximada: ${this.calculateHaversineDistance(origin, destination).toFixed(1)} km`
      ];
    }
  }

  // Verificar si un punto está dentro de los límites de Salta
  isWithinSaltaBounds(location: Location): boolean {
    const saltaBounds = {
      north: -24.7200,
      south: -24.8500,
      east: -65.3500,
      west: -65.5000
    };

    return location.latitude <= saltaBounds.north &&
           location.latitude >= saltaBounds.south &&
           location.longitude >= saltaBounds.west &&
           location.longitude <= saltaBounds.east;
  }

  getMapStyle(): google.maps.MapTypeStyle[] {
    // Estilo personalizado para el mapa (opcional)
    return [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ];
  }
}

export const googleMapsService = new GoogleMapsService();
export default googleMapsService;

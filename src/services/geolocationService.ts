// Servicio de geolocalización para ShareRide
import { Location } from '../types';
import { MAP_CONFIG } from '../constants';

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
  details?: string;
}

class GeolocationService {
  private watchId: number | null = null;
  private currentLocation: Location | null = null;
  private callbacks: ((location: Location) => void)[] = [];
  private errorCallbacks: ((error: GeolocationError) => void)[] = [];

  constructor() {
    // Verificar si la geolocalización está disponible
    if (!this.isGeolocationSupported()) {
      console.warn('Geolocalización no soportada en este navegador');
    }
  }

  isGeolocationSupported(): boolean {
    return 'geolocation' in navigator;
  }

  async getCurrentPosition(options?: GeolocationOptions): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported()) {
        reject(this.createError(0, 'Geolocalización no soportada'));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 300000 // 5 minutos
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.currentLocation = location;
          resolve(location);
        },
        (error) => {
          const geoError = this.handleGeolocationError(error);
          reject(geoError);
        },
        defaultOptions
      );
    });
  }

  async getLocationOrDefault(): Promise<Location> {
    try {
      return await this.getCurrentPosition();
    } catch (error) {
      console.warn('No se pudo obtener ubicación actual, usando ubicación por defecto (Salta)');
      // Retornar ubicación por defecto de Salta
      return {
        latitude: MAP_CONFIG.initialRegion.latitude,
        longitude: MAP_CONFIG.initialRegion.longitude
      };
    }
  }

  startWatching(
    onLocationUpdate: (location: Location) => void,
    onError?: (error: GeolocationError) => void,
    options?: GeolocationOptions
  ): boolean {
    if (!this.isGeolocationSupported()) {
      return false;
    }

    // Agregar callbacks
    this.callbacks.push(onLocationUpdate);
    if (onError) {
      this.errorCallbacks.push(onError);
    }

    // Si ya estamos monitoreando, no iniciar uno nuevo
    if (this.watchId !== null) {
      return true;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: options?.enableHighAccuracy ?? true,
      timeout: options?.timeout ?? 15000,
      maximumAge: options?.maximumAge ?? 60000 // 1 minuto
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        this.currentLocation = location;
        
        // Notificar a todos los callbacks
        this.callbacks.forEach(callback => callback(location));
      },
      (error) => {
        const geoError = this.handleGeolocationError(error);
        this.errorCallbacks.forEach(callback => callback(geoError));
      },
      defaultOptions
    );

    return true;
  }

  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    
    // Limpiar callbacks
    this.callbacks = [];
    this.errorCallbacks = [];
  }

  getCurrentLocationSync(): Location | null {
    return this.currentLocation;
  }

  calculateDistance(point1: Location, point2: Location): number {
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

  calculateBearing(point1: Location, point2: Location): number {
    const dLng = this.toRadians(point2.longitude - point1.longitude);
    const lat1 = this.toRadians(point1.latitude);
    const lat2 = this.toRadians(point2.latitude);
    
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    
    const bearing = Math.atan2(y, x);
    return (this.toDegrees(bearing) + 360) % 360;
  }

  isInRadius(center: Location, point: Location, radiusKm: number): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusKm;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  private handleGeolocationError(error: GeolocationPositionError): GeolocationError {
    let message: string;
    let details: string;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Acceso a ubicación denegado';
        details = 'El usuario denegó el acceso a la geolocalización';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Ubicación no disponible';
        details = 'La información de ubicación no está disponible';
        break;
      case error.TIMEOUT:
        message = 'Tiempo de espera agotado';
        details = 'La solicitud de ubicación tardó demasiado';
        break;
      default:
        message = 'Error desconocido';
        details = 'Ocurrió un error desconocido al obtener la ubicación';
        break;
    }

    return this.createError(error.code, message, details);
  }

  private createError(code: number, message: string, details?: string): GeolocationError {
    return { code, message, details };
  }

  // Método para simular movimiento (útil para demos)
  simulateMovement(
    startLocation: Location,
    endLocation: Location,
    durationMs: number,
    onUpdate: (location: Location, progress: number) => void
  ): () => void {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      if (progress >= 1) {
        onUpdate(endLocation, 1);
        clearInterval(interval);
        return;
      }
      
      // Interpolación lineal para simular movimiento suave
      const currentLocation: Location = {
        latitude: startLocation.latitude + (endLocation.latitude - startLocation.latitude) * progress,
        longitude: startLocation.longitude + (endLocation.longitude - startLocation.longitude) * progress
      };
      
      onUpdate(currentLocation, progress);
    }, 1000); // Actualizar cada segundo
    
    // Retornar función para cancelar la simulación
    return () => clearInterval(interval);
  }
}

export const geolocationService = new GeolocationService();
export default geolocationService;

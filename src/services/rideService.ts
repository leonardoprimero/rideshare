// Servicio para manejar viajes y conductores
import { Driver, Ride, SharedRide, RecurringRide, Location } from '../types';
import { 
  mockDrivers, 
  mockRideHistory, 
  mockSharedRides, 
  mockRecurringRides, 
  calculateDistance, 
  calculateRidePrice 
} from '../data/mockData';

class RideService {
  private readonly RIDES_KEY = 'shareride_rides';
  private readonly DRIVERS_KEY = 'shareride_drivers';
  private readonly SHARED_RIDES_KEY = 'shareride_shared_rides';
  private readonly RECURRING_RIDES_KEY = 'shareride_recurring_rides';

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData(): void {
    // Inicializar datos si no existen
    if (!localStorage.getItem(this.RIDES_KEY)) {
      localStorage.setItem(this.RIDES_KEY, JSON.stringify(mockRideHistory));
    }
    
    if (!localStorage.getItem(this.DRIVERS_KEY)) {
      localStorage.setItem(this.DRIVERS_KEY, JSON.stringify(mockDrivers));
    }
    
    if (!localStorage.getItem(this.SHARED_RIDES_KEY)) {
      localStorage.setItem(this.SHARED_RIDES_KEY, JSON.stringify(mockSharedRides));
    }
    
    if (!localStorage.getItem(this.RECURRING_RIDES_KEY)) {
      localStorage.setItem(this.RECURRING_RIDES_KEY, JSON.stringify(mockRecurringRides));
    }
  }

  // Obtener conductores cercanos
  async getNearbyDrivers(userLocation: Location, radiusKm: number = 5): Promise<Driver[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const drivers = this.getStoredDrivers();
        const nearbyDrivers = drivers.filter(driver => {
          if (!driver.isAvailable) return false;
          
          const distance = calculateDistance(userLocation, driver.location);
          return distance <= radiusKm;
        });

        // Agregar algo de variabilidad en las ubicaciones para simular movimiento
        const driversWithVariation = nearbyDrivers.map(driver => ({
          ...driver,
          location: {
            latitude: driver.location.latitude + (Math.random() * 0.01 - 0.005),
            longitude: driver.location.longitude + (Math.random() * 0.01 - 0.005)
          }
        }));

        resolve(driversWithVariation);
      }, 800);
    });
  }

  // Solicitar un viaje
  async requestRide(rideData: {
    passengerId: string;
    origin: { address: string; location: Location };
    destination: { address: string; location: Location };
    vehicleType?: 'economy' | 'comfort' | 'premium';
    scheduledFor?: string;
  }): Promise<Ride> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const distance = calculateDistance(rideData.origin.location, rideData.destination.location);
        const price = calculateRidePrice(
          distance, 
          rideData.vehicleType || 'economy',
          rideData.scheduledFor
        );

        const newRide: Ride = {
          id: `ride_${Date.now()}`,
          passengerId: rideData.passengerId,
          origin: rideData.origin,
          destination: rideData.destination,
          status: 'pending',
          price: price,
          distance: distance,
          duration: Math.round(distance * 2.5), // Estimación: 2.5 min por km
          createdAt: new Date().toISOString(),
          scheduledFor: rideData.scheduledFor
        };

        // Guardar el viaje
        const rides = this.getStoredRides();
        rides.unshift(newRide);
        localStorage.setItem(this.RIDES_KEY, JSON.stringify(rides));

        resolve(newRide);
      }, 1200);
    });
  }

  // Aceptar un viaje (para conductores)
  async acceptRide(rideId: string, driverId: string): Promise<Ride> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rides = this.getStoredRides();
        const rideIndex = rides.findIndex(r => r.id === rideId);
        
        if (rideIndex === -1) {
          reject(new Error('Viaje no encontrado'));
          return;
        }

        rides[rideIndex] = {
          ...rides[rideIndex],
          status: 'accepted',
          driverId: driverId
        };

        localStorage.setItem(this.RIDES_KEY, JSON.stringify(rides));
        resolve(rides[rideIndex]);
      }, 800);
    });
  }

  // Actualizar estado del viaje
  async updateRideStatus(rideId: string, status: Ride['status']): Promise<Ride> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rides = this.getStoredRides();
        const rideIndex = rides.findIndex(r => r.id === rideId);
        
        if (rideIndex === -1) {
          reject(new Error('Viaje no encontrado'));
          return;
        }

        rides[rideIndex] = {
          ...rides[rideIndex],
          status: status
        };

        localStorage.setItem(this.RIDES_KEY, JSON.stringify(rides));
        resolve(rides[rideIndex]);
      }, 500);
    });
  }

  // Obtener historial de viajes de un usuario
  getRideHistory(userId: string): Ride[] {
    const rides = this.getStoredRides();
    return rides.filter(ride => 
      ride.passengerId === userId || ride.driverId === userId
    );
  }

  // Obtener viajes activos de un conductor
  getActiveRidesForDriver(driverId: string): Ride[] {
    const rides = this.getStoredRides();
    return rides.filter(ride => 
      ride.driverId === driverId && 
      ['accepted', 'in_progress'].includes(ride.status)
    );
  }

  // Obtener viajes pendientes (para conductores)
  getPendingRides(driverLocation: Location, radiusKm: number = 10): Ride[] {
    const rides = this.getStoredRides();
    return rides.filter(ride => {
      if (ride.status !== 'pending') return false;
      
      const distance = calculateDistance(driverLocation, ride.origin.location);
      return distance <= radiusKm;
    });
  }

  // Métodos para viajes compartidos
  getSharedRides(): SharedRide[] {
    const stored = localStorage.getItem(this.SHARED_RIDES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async joinSharedRide(rideId: string, passengerId: string): Promise<SharedRide> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sharedRides = this.getSharedRides();
        const rideIndex = sharedRides.findIndex(r => r.id === rideId);
        
        if (rideIndex === -1) {
          reject(new Error('Viaje compartido no encontrado'));
          return;
        }

        if (sharedRides[rideIndex].passengers >= sharedRides[rideIndex].availableSeats) {
          reject(new Error('No hay asientos disponibles'));
          return;
        }

        // Log para desarrollo - en producción se usaría el passengerId para tracking
        console.log('Pasajero uniéndose al viaje:', passengerId);

        sharedRides[rideIndex] = {
          ...sharedRides[rideIndex],
          passengers: sharedRides[rideIndex].passengers + 1
        };

        localStorage.setItem(this.SHARED_RIDES_KEY, JSON.stringify(sharedRides));
        resolve(sharedRides[rideIndex]);
      }, 800);
    });
  }

  // Métodos para viajes recurrentes
  getRecurringRides(): RecurringRide[] {
    const stored = localStorage.getItem(this.RECURRING_RIDES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async createRecurringRide(rideData: Omit<RecurringRide, 'id'>): Promise<RecurringRide> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecurringRide: RecurringRide = {
          ...rideData,
          id: `recurring_${Date.now()}`
        };

        const recurringRides = this.getRecurringRides();
        recurringRides.unshift(newRecurringRide);
        localStorage.setItem(this.RECURRING_RIDES_KEY, JSON.stringify(recurringRides));

        resolve(newRecurringRide);
      }, 1000);
    });
  }

  // Obtener viajes recurrentes de un conductor
  getDriverRecurringRides(driverId: string): RecurringRide[] {
    const recurringRides = this.getRecurringRides();
    return recurringRides.filter(ride => ride.driverId === driverId);
  }

  // Métodos privados de almacenamiento
  private getStoredRides(): Ride[] {
    const stored = localStorage.getItem(this.RIDES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private getStoredDrivers(): Driver[] {
    const stored = localStorage.getItem(this.DRIVERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Actualizar ubicación de conductor
  updateDriverLocation(driverId: string, location: Location): void {
    const drivers = this.getStoredDrivers();
    const driverIndex = drivers.findIndex(d => d.id === driverId);
    
    if (driverIndex !== -1) {
      drivers[driverIndex] = {
        ...drivers[driverIndex],
        location: location
      };
      localStorage.setItem(this.DRIVERS_KEY, JSON.stringify(drivers));
    }
  }

  // Cambiar disponibilidad de conductor
  updateDriverAvailability(driverId: string, isAvailable: boolean): void {
    const drivers = this.getStoredDrivers();
    const driverIndex = drivers.findIndex(d => d.id === driverId);
    
    if (driverIndex !== -1) {
      drivers[driverIndex] = {
        ...drivers[driverIndex],
        isAvailable: isAvailable
      };
      localStorage.setItem(this.DRIVERS_KEY, JSON.stringify(drivers));
    }
  }

  // Generar datos de demostración adicionales
  generateDemoRides(userId: string, count: number = 5): Ride[] {
    const rides = this.getStoredRides();
    const newRides: Ride[] = [];

    for (let i = 0; i < count; i++) {
      const ride: Ride = {
        id: `demo_ride_${Date.now()}_${i}`,
        passengerId: userId,
        driverId: mockDrivers[Math.floor(Math.random() * mockDrivers.length)].id,
        origin: {
          address: 'Ubicación de origen demo',
          location: { latitude: -24.7900, longitude: -65.4100 }
        },
        destination: {
          address: 'Ubicación de destino demo',
          location: { latitude: -24.7283, longitude: -65.4111 }
        },
        status: ['completed', 'cancelled'][Math.floor(Math.random() * 2)] as Ride['status'],
        price: Math.floor(Math.random() * 800) + 200,
        distance: Math.round((Math.random() * 15 + 1) * 100) / 100,
        duration: Math.floor(Math.random() * 25) + 5,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      newRides.push(ride);
    }

    const allRides = [...newRides, ...rides];
    localStorage.setItem(this.RIDES_KEY, JSON.stringify(allRides));
    
    return newRides;
  }
}

export const rideService = new RideService();
export default rideService;

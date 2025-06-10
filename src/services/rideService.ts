import apiClient from '../lib/api';
import { User, Location, Ride as FrontendRide, RouteStatus as FrontendRouteStatus } from '../types'; // Assuming FrontendRide is the detailed type used by UI

// Interfaces for Backend Data (matching Prisma schema)
interface BackendDriverInfo { // Subset of User model from backend for driver details
  id: string;
  name: string | null;
  email: string;
  // Add other relevant driver fields if backend sends them within Route
}

export interface BackendRoute {
  id: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  departureTime: string; // ISO Date string
  estimatedArrivalTime?: string | null; // ISO Date string
  status: FrontendRouteStatus; // 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  price?: number | null;
  driverId: string;
  driver: BackendDriverInfo; // Embedded driver info
  passengers: Pick<User, 'id' | 'name'>[]; // List of passengers (subset of User)
  // Add other fields if present in backend response, e.g., createdAt, updatedAt
  createdAt: string;
  updatedAt: string;
}

// Payload for creating a route (driver)
export interface CreateRoutePayload {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  departureTime: string; // ISO Date string
  estimatedArrivalTime?: string;
  price?: number;
}

// Function to map BackendRoute to FrontendRide (or a new FrontendRoute type)
const mapBackendRouteToFrontendRide = (route: BackendRoute): FrontendRide => {
  return {
    id: route.id,
    driverId: route.driverId,
    driverName: route.driver.name || 'N/A',
    passengers: route.passengers,
    origin: {
      address: `Lat: ${route.originLat}, Lng: ${route.originLng}`,
      location: { latitude: route.originLat, longitude: route.originLng },
    },
    destination: {
      address: `Lat: ${route.destinationLat}, Lng: ${route.destinationLng}`,
      location: { latitude: route.destinationLat, longitude: route.destinationLng },
    },
    status: route.status,
    price: route.price || 0,
    createdAt: route.createdAt,
    departureTime: route.departureTime,
    // Ensure FrontendRide type in src/types/index.ts includes all these fields
    // and defaults for any other fields it might have (like distance, duration, vehicleType etc.)
    // For example:
    // distance: 0, // Placeholder if not available from backend
    // duration: 0, // Placeholder
    // vehicleType: 'standard', // Placeholder
  };
};


class RideService {
  // For Drivers: Create a new route
  async createDriverRoute(routeData: CreateRoutePayload): Promise<FrontendRide> {
    const response = await apiClient.post<BackendRoute>('/routes', routeData);
    return mapBackendRouteToFrontendRide(response.data);
  }

  // For Passengers/Anyone: Get all available (PENDING) routes
  async getAvailableRoutes(): Promise<FrontendRide[]> {
    const response = await apiClient.get<BackendRoute[]>('/routes');
    return response.data.map(mapBackendRouteToFrontendRide);
  }

  // For Anyone: Get details of a specific route by its ID
  async getRouteById(routeId: string): Promise<FrontendRide | null> {
    try {
      const response = await apiClient.get<BackendRoute>(`/routes/${routeId}`);
      return mapBackendRouteToFrontendRide(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // For Passengers: Join a route
  async joinRoute(routeId: string): Promise<FrontendRide> {
    const response = await apiClient.post<BackendRoute>(`/routes/${routeId}/join`);
    return mapBackendRouteToFrontendRide(response.data);
  }

  // For Drivers: Get all routes they have created
  async getDriverCreatedRoutes(): Promise<FrontendRide[]> {
    const response = await apiClient.get<BackendRoute[]>('/routes/driver/my-routes');
    return response.data.map(mapBackendRouteToFrontendRide);
  }

  // For Drivers: Update the status of one of their routes
  async updateDriverRouteStatus(routeId: string, status: FrontendRouteStatus): Promise<FrontendRide> {
    const response = await apiClient.put<BackendRoute>(`/routes/${routeId}/status`, { status });
    return mapBackendRouteToFrontendRide(response.data);
  }

  async getMyRideHistory(userId: string, allRoutes: BackendRoute[]): Promise<FrontendRide[]> {
      const history: FrontendRide[] = [];
      for (const route of allRoutes) {
          if (route.driverId === userId && (route.status === 'COMPLETED' || route.status === 'CANCELLED')) {
              history.push(mapBackendRouteToFrontendRide(route));
          } else {
              const passengerEntry = route.passengers.find(p => p.id === userId);
              if (passengerEntry && (route.status === 'COMPLETED' || route.status === 'CANCELLED')) {
                  history.push(mapBackendRouteToFrontendRide(route));
              }
          }
      }
      return history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

}

export const rideService = new RideService();
export default rideService;

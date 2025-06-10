// Tipos básicos para la aplicación web RideShare

export interface Location {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string; // In mapBackendUserToFrontendUser, this is backendUser.name || ''
  email: string;
  phone: string; // mapBackendUserToFrontendUser has this as placeholder ''
  rating: number; // mapBackendUserToFrontendUser has this as placeholder 0
  profilePicture?: string; // mapBackendUserToFrontendUser has this as placeholder ''
  isDriver: boolean;
}

// New/Updated types based on backend integration
export type RouteStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface UserReference {
  id: string;
  name: string | null;
}

export interface Ride { // Represents FrontendRide structure, updated for backend alignment
  id: string;
  driverId: string;
  driverName: string;
  passengers: UserReference[];
  origin: { address: string; location: Location };
  destination: { address: string; location: Location };
  status: RouteStatus;
  price: number;
  createdAt: string; // ISO Date string
  departureTime: string; // ISO Date string
  estimatedArrivalTime?: string | null;
  // Optional fields that were in old mock data or UI might use
  distance?: number;
  duration?: number;
  vehicleType?: string;
  passengerId?: string; // If UI needs to highlight current user's involvement as primary passenger
}

// Kept existing types that might still be in use or for future features
export interface Driver { // This might need review if it's used for displaying driver info from backend User type
  id: string;
  userId: string; // Potentially redundant if id is the same as User.id
  name: string;
  rating: number;
  vehicle: Vehicle;
  location: Location; // Backend currently does not provide live driver locations
  isAvailable: boolean;
  profilePicture?: string;
}

export interface Vehicle { // This is likely for driver's vehicle details, backend doesn't have this yet
  id: string;
  model: string;
  color: string;
  licensePlate: string;
  capacity: number;
  type: 'economy' | 'comfort' | 'premium';
}

export interface RecurringRide { // This is a mock/frontend-specific type for now
  id: string;
  driverId: string;
  origin: {
    name: string;
    address: string;
    location: Location;
  };
  destination: {
    name: string;
    address: string;
    location: Location;
  };
  days: string[];
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  passengers: Array<{ // This passenger structure is different from UserReference
    id: string;
    name: string;
    rating: number;
  }>;
}

export interface SharedRide { // This is a mock/frontend-specific type for now
  id: string;
  driver: { // This driver structure is different
    id: string;
    name: string;
    rating: number;
  };
  origin: {
    name: string;
    address: string;
    location: Location;
  };
  destination: {
    name: string;
    address: string;
    location: Location;
  };
  departureTime: string;
  departureDate: string;
  availableSeats: number;
  pricePerSeat: number;
  passengers: number; // This is just a count, not a list
  isRecurring: boolean;
  recurringDays?: string[];
}

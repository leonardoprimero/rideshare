// Tipos básicos para la aplicación web RideShare

export interface Location {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  profilePicture?: string;
  isDriver: boolean;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  rating: number;
  vehicle: Vehicle;
  location: Location;
  isAvailable: boolean;
  profilePicture?: string;
}

export interface Vehicle {
  id: string;
  model: string;
  color: string;
  licensePlate: string;
  capacity: number;
  type: 'economy' | 'comfort' | 'premium';
}

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  origin: {
    address: string;
    location: Location;
  };
  destination: {
    address: string;
    location: Location;
  };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  distance: number;
  duration: number;
  createdAt: string;
  scheduledFor?: string;
}

export interface RecurringRide {
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
  passengers: Array<{
    id: string;
    name: string;
    rating: number;
  }>;
}

export interface SharedRide {
  id: string;
  driver: {
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
  passengers: number;
  isRecurring: boolean;
  recurringDays?: string[];
}

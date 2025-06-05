// Base de datos mock para ShareRide - Datos realistas de Salta, Argentina
import { User, Driver, Vehicle, Ride, RecurringRide, SharedRide, Location } from '../types';

// Ubicaciones reales de Salta con coordenadas precisas
export const saltaLocations = {
  // Centro histórico
  plazaJulio: { latitude: -24.7900, longitude: -65.4100, name: 'Plaza 9 de Julio', address: 'Centro de Salta' },
  catedral: { latitude: -24.7897, longitude: -65.4097, name: 'Catedral Basílica', address: 'España 558' },
  cabildo: { latitude: -24.7903, longitude: -65.4092, name: 'Cabildo Histórico', address: 'Caseros 549' },
  
  // Centros comerciales y servicios
  shoppingAltaNoa: { latitude: -24.7739, longitude: -65.4219, name: 'Alto NOA Shopping', address: 'Av. Bicentenario 702' },
  shoppingPortalSalta: { latitude: -24.7856, longitude: -65.4289, name: 'Portal Salta Shopping', address: 'Av. Bolivia 4650' },
  terminalOmnibus: { latitude: -24.7956, longitude: -65.4214, name: 'Terminal de Ómnibus', address: 'Av. Hipólito Yrigoyen 339' },
  
  // Hospitales y salud
  hospitalDelMilagro: { latitude: -24.7667, longitude: -65.4222, name: 'Hospital del Milagro', address: 'Av. Sarmiento 557' },
  hospitalSanBernardo: { latitude: -24.7778, longitude: -65.4056, name: 'Hospital San Bernardo', address: 'Tobías 69' },
  
  // Universidades y educación
  universidadNacional: { latitude: -24.7283, longitude: -65.4111, name: 'Universidad Nacional de Salta', address: 'Av. Bolivia 5150' },
  universidadCatolica: { latitude: -24.7822, longitude: -65.4056, name: 'Universidad Católica de Salta', address: 'Campo Castañares' },
  
  // Barrios residenciales
  granBourg: { latitude: -24.7650, longitude: -65.3850, name: 'Grand Bourg', address: 'Zona residencial norte' },
  cerroSanBernardo: { latitude: -24.7778, longitude: -65.3972, name: 'Cerro San Bernardo', address: 'Zona turística' },
  elTipal: { latitude: -24.8200, longitude: -65.4300, name: 'El Tipal', address: 'Zona sur de Salta' },
  villaLasRosas: { latitude: -24.7500, longitude: -65.3900, name: 'Villa Las Rosas', address: 'Zona residencial' },
  
  // Aeropuerto y transporte
  aeropuerto: { latitude: -24.8444, longitude: -65.4861, name: 'Aeropuerto Internacional', address: 'Ruta Nacional 51 Km 5' },
  estacionTren: { latitude: -24.7856, longitude: -65.4125, name: 'Estación de Tren', address: 'Av. Ameghino' },
  
  // Zonas de trabajo y oficinas
  microcentro: { latitude: -24.7889, longitude: -65.4111, name: 'Microcentro', address: 'Zona comercial central' },
  parqueIndustrial: { latitude: -24.7200, longitude: -65.3800, name: 'Parque Industrial', address: 'Zona industrial norte' }
};

// Base de usuarios pasajeros (10-15 usuarios)
export const mockPassengers: User[] = [
  {
    id: 'user_001',
    name: 'María Elena González',
    email: 'maria.gonzalez@email.com',
    phone: '+54 387 456 7890',
    rating: 4.8,
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    isDriver: false
  },
  {
    id: 'user_002', 
    name: 'Carlos Alberto Mendoza',
    email: 'carlos.mendoza@email.com',
    phone: '+54 387 456 7891',
    rating: 4.6,
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    isDriver: false
  },
  {
    id: 'user_003',
    name: 'Ana Sofía Herrera',
    email: 'ana.herrera@email.com', 
    phone: '+54 387 456 7892',
    rating: 4.9,
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    isDriver: false
  },
  {
    id: 'user_004',
    name: 'Roberto Daniel Suárez',
    email: 'roberto.suarez@email.com',
    phone: '+54 387 456 7893', 
    rating: 4.7,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isDriver: false
  },
  {
    id: 'user_005',
    name: 'Lucía Fernanda Torres',
    email: 'lucia.torres@email.com',
    phone: '+54 387 456 7894',
    rating: 4.8,
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    isDriver: false
  },
  {
    id: 'user_006',
    name: 'José Miguel Vargas',
    email: 'jose.vargas@email.com',
    phone: '+54 387 456 7895',
    rating: 4.5,
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isDriver: false
  },
  {
    id: 'user_007',
    name: 'Patricia Alejandra Silva',
    email: 'patricia.silva@email.com',
    phone: '+54 387 456 7896',
    rating: 4.9,
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    isDriver: false
  },
  {
    id: 'user_008',
    name: 'Eduardo Antonio López',
    email: 'eduardo.lopez@email.com', 
    phone: '+54 387 456 7897',
    rating: 4.4,
    profilePicture: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150',
    isDriver: false
  },
  {
    id: 'user_009',
    name: 'Valentina Isabel Morales',
    email: 'valentina.morales@email.com',
    phone: '+54 387 456 7898',
    rating: 4.8,
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isDriver: false
  },
  {
    id: 'user_010',
    name: 'Diego Fernando Castro',
    email: 'diego.castro@email.com',
    phone: '+54 387 456 7899',
    rating: 4.6,
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    isDriver: false
  },
  {
    id: 'user_011',
    name: 'Carmen Rosa Jiménez',
    email: 'carmen.jimenez@email.com',
    phone: '+54 387 456 7800',
    rating: 4.7,
    profilePicture: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150',
    isDriver: false
  },
  {
    id: 'user_012',
    name: 'Francisco Javier Ruiz',
    email: 'francisco.ruiz@email.com',
    phone: '+54 387 456 7801',
    rating: 4.5,
    profilePicture: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150',
    isDriver: false
  }
];

// Vehículos realistas con marcas populares en Argentina
export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle_001',
    model: 'Toyota Corolla 2020',
    color: 'Blanco',
    licensePlate: 'SAL 123 AB',
    capacity: 4,
    type: 'economy'
  },
  {
    id: 'vehicle_002',
    model: 'Honda Civic 2019',
    color: 'Gris Plata',
    licensePlate: 'SAL 456 CD',
    capacity: 4,
    type: 'comfort'
  },
  {
    id: 'vehicle_003',
    model: 'Chevrolet Cruze 2021',
    color: 'Azul Oscuro',
    licensePlate: 'SAL 789 EF',
    capacity: 4,
    type: 'comfort'
  },
  {
    id: 'vehicle_004',
    model: 'Ford Focus 2020',
    color: 'Rojo',
    licensePlate: 'SAL 321 GH',
    capacity: 4,
    type: 'economy'
  },
  {
    id: 'vehicle_005',
    model: 'Volkswagen Vento 2019',
    color: 'Negro',
    licensePlate: 'SAL 654 IJ',
    capacity: 4,
    type: 'comfort'
  },
  {
    id: 'vehicle_006',
    model: 'Mercedes Benz C-Class 2021',
    color: 'Blanco Perla',
    licensePlate: 'SAL 987 KL',
    capacity: 4,
    type: 'premium'
  },
  {
    id: 'vehicle_007',
    model: 'BMW Serie 3 2020',
    color: 'Gris Metálico',
    licensePlate: 'SAL 147 MN',
    capacity: 4,
    type: 'premium'
  },
  {
    id: 'vehicle_008',
    model: 'Peugeot 308 2019',
    color: 'Blanco',
    licensePlate: 'SAL 258 OP',
    capacity: 4,
    type: 'economy'
  },
  {
    id: 'vehicle_009',
    model: 'Renault Logan 2020',
    color: 'Gris',
    licensePlate: 'SAL 369 QR',
    capacity: 4,
    type: 'economy'
  },
  {
    id: 'vehicle_010',
    model: 'Audi A4 2021',
    color: 'Negro Brillante',
    licensePlate: 'SAL 741 ST',
    capacity: 4,
    type: 'premium'
  }
];

// Conductores con datos realistas (8-10 conductores)
export const mockDrivers: Driver[] = [
  {
    id: 'driver_001',
    userId: 'user_driver_001',
    name: 'Carlos Roberto Fernández',
    rating: 4.8,
    vehicle: mockVehicles[0],
    location: saltaLocations.microcentro,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
  },
  {
    id: 'driver_002', 
    userId: 'user_driver_002',
    name: 'Laura Beatriz Sánchez',
    rating: 4.9,
    vehicle: mockVehicles[1],
    location: saltaLocations.shoppingAltaNoa,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
  },
  {
    id: 'driver_003',
    userId: 'user_driver_003', 
    name: 'Miguel Ángel Torres',
    rating: 4.7,
    vehicle: mockVehicles[2],
    location: saltaLocations.universidadNacional,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'driver_004',
    userId: 'user_driver_004',
    name: 'Andrea Victoria Morales',
    rating: 4.6,
    vehicle: mockVehicles[3],
    location: saltaLocations.terminalOmnibus,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  },
  {
    id: 'driver_005',
    userId: 'user_driver_005',
    name: 'Sebastián José Ramírez',
    rating: 4.8,
    vehicle: mockVehicles[4],
    location: saltaLocations.hospitalDelMilagro,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'driver_006',
    userId: 'user_driver_006',
    name: 'Claudia Patricia Vega',
    rating: 4.9,
    vehicle: mockVehicles[5],
    location: saltaLocations.aeropuerto,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  {
    id: 'driver_007',
    userId: 'user_driver_007',
    name: 'Fernando Luis Herrera',
    rating: 4.5,
    vehicle: mockVehicles[6],
    location: saltaLocations.cerroSanBernardo,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'driver_008',
    userId: 'user_driver_008',
    name: 'Marcela Susana Castro',
    rating: 4.7,
    vehicle: mockVehicles[7],
    location: saltaLocations.granBourg,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150'
  },
  {
    id: 'driver_009',
    userId: 'user_driver_009',
    name: 'Ricardo Alejandro Díaz',
    rating: 4.6,
    vehicle: mockVehicles[8],
    location: saltaLocations.villaLasRosas,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150'
  },
  {
    id: 'driver_010',
    userId: 'user_driver_010',
    name: 'Gabriela Inés Romero',
    rating: 4.8,
    vehicle: mockVehicles[9],
    location: saltaLocations.shoppingPortalSalta,
    isAvailable: true,
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  }
];

// Historial de viajes realistas
export const mockRideHistory: Ride[] = [
  {
    id: 'ride_001',
    passengerId: 'user_001',
    driverId: 'driver_001',
    origin: {
      address: saltaLocations.plazaJulio.address,
      location: saltaLocations.plazaJulio
    },
    destination: {
      address: saltaLocations.universidadNacional.address,
      location: saltaLocations.universidadNacional
    },
    status: 'completed',
    price: 850,
    distance: 8.5,
    duration: 18,
    createdAt: '2024-06-04T14:30:00.000Z'
  },
  {
    id: 'ride_002',
    passengerId: 'user_002',
    driverId: 'driver_002',
    origin: {
      address: saltaLocations.granBourg.address,
      location: saltaLocations.granBourg
    },
    destination: {
      address: saltaLocations.microcentro.address,
      location: saltaLocations.microcentro
    },
    status: 'completed',
    price: 650,
    distance: 5.2,
    duration: 12,
    createdAt: '2024-06-04T08:15:00.000Z'
  },
  {
    id: 'ride_003',
    passengerId: 'user_003',
    driverId: 'driver_003',
    origin: {
      address: saltaLocations.terminalOmnibus.address,
      location: saltaLocations.terminalOmnibus
    },
    destination: {
      address: saltaLocations.aeropuerto.address,
      location: saltaLocations.aeropuerto
    },
    status: 'completed',
    price: 1200,
    distance: 12.8,
    duration: 25,
    createdAt: '2024-06-03T16:45:00.000Z'
  }
];

// Viajes compartidos disponibles
export const mockSharedRides: SharedRide[] = [
  {
    id: 'shared_001',
    driver: {
      id: 'driver_001',
      name: 'Carlos Roberto Fernández',
      rating: 4.8
    },
    origin: {
      name: 'Grand Bourg',
      address: saltaLocations.granBourg.address,
      location: saltaLocations.granBourg
    },
    destination: {
      name: 'Microcentro',
      address: saltaLocations.microcentro.address,
      location: saltaLocations.microcentro
    },
    departureTime: '07:30',
    departureDate: '2024-06-05',
    availableSeats: 3,
    pricePerSeat: 400,
    passengers: 1,
    isRecurring: true,
    recurringDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  },
  {
    id: 'shared_002',
    driver: {
      id: 'driver_002',
      name: 'Laura Beatriz Sánchez',
      rating: 4.9
    },
    origin: {
      name: 'Universidad Nacional',
      address: saltaLocations.universidadNacional.address,
      location: saltaLocations.universidadNacional
    },
    destination: {
      name: 'Centro Histórico',
      address: saltaLocations.plazaJulio.address,
      location: saltaLocations.plazaJulio
    },
    departureTime: '18:00',
    departureDate: '2024-06-05',
    availableSeats: 2,
    pricePerSeat: 500,
    passengers: 2,
    isRecurring: false
  },
  {
    id: 'shared_003',
    driver: {
      id: 'driver_003',
      name: 'Miguel Ángel Torres',
      rating: 4.7
    },
    origin: {
      name: 'El Tipal',
      address: saltaLocations.elTipal.address,
      location: saltaLocations.elTipal
    },
    destination: {
      name: 'Shopping Alto NOA',
      address: saltaLocations.shoppingAltaNoa.address,
      location: saltaLocations.shoppingAltaNoa
    },
    departureTime: '14:00',
    departureDate: '2024-06-06',
    availableSeats: 4,
    pricePerSeat: 350,
    passengers: 0,
    isRecurring: false
  }
];

// Viajes recurrentes
export const mockRecurringRides: RecurringRide[] = [
  {
    id: 'recurring_001',
    driverId: 'driver_001',
    origin: {
      name: 'Grand Bourg',
      address: saltaLocations.granBourg.address,
      location: saltaLocations.granBourg
    },
    destination: {
      name: 'Microcentro',
      address: saltaLocations.microcentro.address,
      location: saltaLocations.microcentro
    },
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    departureTime: '07:30',
    availableSeats: 3,
    pricePerSeat: 400,
    passengers: [
      { id: 'user_001', name: 'María Elena González', rating: 4.8 }
    ]
  },
  {
    id: 'recurring_002',
    driverId: 'driver_005',
    origin: {
      name: 'Villa Las Rosas',
      address: saltaLocations.villaLasRosas.address,
      location: saltaLocations.villaLasRosas
    },
    destination: {
      name: 'Hospital del Milagro',
      address: saltaLocations.hospitalDelMilagro.address,
      location: saltaLocations.hospitalDelMilagro
    },
    days: ['monday', 'wednesday', 'friday'],
    departureTime: '06:45',
    availableSeats: 2,
    pricePerSeat: 300,
    passengers: []
  }
];

// Configuración de precios por distancia y tipo de vehículo
export const pricingConfig = {
  basePrice: 200, // Precio base en pesos argentinos
  pricePerKm: 50,  // Precio por kilómetro
  multipliers: {
    economy: 1.0,
    comfort: 1.3,
    premium: 1.8
  },
  timeMultipliers: {
    morning: 1.1,    // 6:00 - 9:00
    peak: 1.5,       // 17:00 - 20:00
    night: 1.2,      // 22:00 - 6:00
    normal: 1.0      // Resto del día
  }
};

// Función para calcular precios realistas
export const calculateRidePrice = (
  distance: number, 
  vehicleType: 'economy' | 'comfort' | 'premium',
  departureTime?: string
): number => {
  let price = pricingConfig.basePrice + (distance * pricingConfig.pricePerKm);
  price *= pricingConfig.multipliers[vehicleType];
  
  if (departureTime) {
    const hour = parseInt(departureTime.split(':')[0]);
    if (hour >= 6 && hour <= 9) {
      price *= pricingConfig.timeMultipliers.morning;
    } else if (hour >= 17 && hour <= 20) {
      price *= pricingConfig.timeMultipliers.peak;
    } else if (hour >= 22 || hour <= 6) {
      price *= pricingConfig.timeMultipliers.night;
    }
  }
  
  return Math.round(price);
};

// Función para calcular distancia aproximada entre dos puntos
export const calculateDistance = (
  point1: Location,
  point2: Location
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Redondear a 2 decimales
};

export default {
  mockPassengers,
  mockDrivers,
  mockVehicles,
  mockRideHistory,
  mockSharedRides,
  mockRecurringRides,
  saltaLocations,
  pricingConfig,
  calculateRidePrice,
  calculateDistance
};

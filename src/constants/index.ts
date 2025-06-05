// Constantes para la aplicación web RideShare

export const COLORS = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  accent: '#f72585',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#212529',
  border: '#e9ecef',
  notification: '#ff4d6d',
  success: '#4cc9f0',
  error: '#f94144',
  warning: '#f9c74f',
  darkGray: '#6c757d',
  lightGray: '#dee2e6',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STATS: '/stats',
  PASSENGER: {
    HOME: '/passenger',
    SEARCH_DESTINATION: '/passenger/search',
    RIDE_REQUEST: '/passenger/request',
    RIDE_TRACKING: '/passenger/tracking',
    RIDE_HISTORY: '/passenger/history',
    SCHEDULED_RIDES: '/passenger/scheduled',
    SHARED_RIDES: '/passenger/shared',
  },
  DRIVER: {
    HOME: '/driver',
    RIDE_REQUESTS: '/driver/requests',
    ACTIVE_RIDE: '/driver/active',
    EARNINGS: '/driver/earnings',
    RECURRING_RIDES: '/driver/recurring',
  },
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// Coordenadas actualizadas para Salta, Argentina
export const MAP_CONFIG = {
  initialRegion: {
    latitude: -24.7859,
    longitude: -65.4117,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  defaultZoom: 14,
  googleMapsApiKey: 'AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik', // API Key para desarrollo
};

export const API_CONFIG = {
  baseUrl: 'https://api.rideshare-example.com',
  timeout: 10000,
  retryAttempts: 3,
};

export const VEHICLE_TYPES = [
  {
    id: 'economy',
    name: 'Económico',
    description: 'Opción más económica',
    capacity: 4,
    priceMultiplier: 1.0,
    icon: '🚗',
  },
  {
    id: 'comfort',
    name: 'Confort',
    description: 'Más espacio y comodidad',
    capacity: 4,
    priceMultiplier: 1.3,
    icon: '🚙',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Experiencia de lujo',
    capacity: 4,
    priceMultiplier: 1.8,
    icon: '🚘',
  },
];

export const WEEK_DAYS = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' },
];

// Ubicaciones populares en Salta, Argentina
export const POPULAR_LOCATIONS_SALTA = [
  {
    id: 'plaza9dejulio',
    name: 'Plaza 9 de Julio',
    address: 'Centro de Salta',
    latitude: -24.7900,
    longitude: -65.4100,
  },
  {
    id: 'catedral',
    name: 'Catedral Basílica de Salta',
    address: 'Calle España 558, Salta',
    latitude: -24.7897,
    longitude: -65.4097,
  },
  {
    id: 'cabildo',
    name: 'Cabildo Histórico',
    address: 'Caseros 549, Salta',
    latitude: -24.7903,
    longitude: -65.4092,
  },
  {
    id: 'sanfrancisco',
    name: 'Iglesia San Francisco',
    address: 'Córdoba 33, Salta',
    latitude: -24.7881,
    longitude: -65.4119,
  },
  {
    id: 'sanbernardomountain',
    name: 'Cerro San Bernardo',
    address: 'Salta',
    latitude: -24.7778,
    longitude: -65.3972,
  },
  {
    id: 'museodearqueologia',
    name: 'Museo de Arqueología de Alta Montaña',
    address: 'Mitre 77, Salta',
    latitude: -24.7908,
    longitude: -65.4083,
  },
  {
    id: 'mercadosanmiguel',
    name: 'Mercado San Miguel',
    address: 'Av. San Martín y Jujuy, Salta',
    latitude: -24.7867,
    longitude: -65.4125,
  },
  {
    id: 'parque20defebrero',
    name: 'Parque 20 de Febrero',
    address: 'Av. Hipólito Yrigoyen, Salta',
    latitude: -24.8011,
    longitude: -65.4108,
  },
  {
    id: 'universidad',
    name: 'Universidad Nacional de Salta',
    address: 'Av. Bolivia 5150, Salta',
    latitude: -24.7283,
    longitude: -65.4111,
  },
  {
    id: 'aeropuerto',
    name: 'Aeropuerto Internacional de Salta',
    address: 'Ruta Nacional 51 Km 5, Salta',
    latitude: -24.8444,
    longitude: -65.4861,
  },
  {
    id: 'shoppingaltanoa',
    name: 'Alto NOA Shopping',
    address: 'Av. Bicentenario de la Batalla de Salta 702, Salta',
    latitude: -24.7739,
    longitude: -65.4219,
  },
  {
    id: 'terminaldebus',
    name: 'Terminal de Ómnibus de Salta',
    address: 'Av. Hipólito Yrigoyen 339, Salta',
    latitude: -24.7956,
    longitude: -65.4214,
  }
];

// Rutas comunes en Salta para ejemplos
export const COMMON_ROUTES_SALTA = [
  {
    id: 'route1',
    name: 'Centro a Universidad',
    origin: 'plaza9dejulio',
    destination: 'universidad',
    estimatedTime: '20',
    estimatedDistance: '7.5',
    estimatedPrice: '800',
  },
  {
    id: 'route2',
    name: 'Centro a Aeropuerto',
    origin: 'plaza9dejulio',
    destination: 'aeropuerto',
    estimatedTime: '25',
    estimatedDistance: '8.2',
    estimatedPrice: '950',
  },
  {
    id: 'route3',
    name: 'Shopping a Centro',
    origin: 'shoppingaltanoa',
    destination: 'plaza9dejulio',
    estimatedTime: '15',
    estimatedDistance: '3.5',
    estimatedPrice: '600',
  },
  {
    id: 'route4',
    name: 'Terminal a Cerro San Bernardo',
    origin: 'terminaldebus',
    destination: 'sanbernardomountain',
    estimatedTime: '18',
    estimatedDistance: '4.8',
    estimatedPrice: '700',
  },
];

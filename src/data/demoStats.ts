// Estadísticas de demostración para presentar a inversionistas
export const demoStats = {
  // Estadísticas generales de la plataforma
  platform: {
    totalUsers: 1250,
    activeUsers: 890,
    totalDrivers: 245,
    activeDrivers: 180,
    totalRides: 8450,
    completedRides: 7890,
    monthlyGrowth: 28,
    userRetention: 85,
    averageRating: 4.7,
    citiesCovered: 3,
  },

  // Estadísticas financieras
  financial: {
    monthlyRevenue: 456780, // en pesos argentinos
    averageRideValue: 650,
    driverEarnings: 320000,
    platformCommission: 15, // porcentaje
    yearlyProjection: 5480000,
    revenueGrowth: 35,
  },

  // Estadísticas de Salta específicamente
  salta: {
    registeredUsers: 650,
    activeDrivers: 95,
    dailyRides: 180,
    averageWaitTime: 4.2, // minutos
    peakHours: ['7:00-9:00', '17:00-20:00'],
    popularRoutes: [
      { from: 'Grand Bourg', to: 'Microcentro', rides: 45 },
      { from: 'Universidad', to: 'Centro', rides: 38 },
      { from: 'Centro', to: 'Aeropuerto', rides: 28 },
      { from: 'El Tipal', to: 'Shopping', rides: 22 },
    ],
    coverage: {
      centerRadius: 15, // km desde el centro
      neighborhoods: 28,
      sharedRidesPercentage: 35,
    }
  },

  // Proyecciones de crecimiento
  projections: {
    nextMonth: {
      newUsers: 180,
      newDrivers: 35,
      expectedRides: 2100,
      revenueIncrease: 22,
    },
    nextQuarter: {
      marketPenetration: 12, // porcentaje del mercado total
      newCities: 2,
      estimatedUsers: 2800,
      estimatedRevenue: 1890000,
    },
    yearEnd: {
      totalUsers: 4500,
      totalDrivers: 680,
      monthlyRides: 15000,
      marketShare: 25,
    }
  },

  // Datos comparativos del mercado
  market: {
    saltaPopulation: 618375,
    targetDemographic: 185000, // población objetivo (18-65 años con smartphone)
    currentPenetration: 0.35, // porcentaje actual
    competitorPricing: {
      taxi: 850, // precio promedio taxi tradicional
      uber: 720, // precio promedio Uber (si estuviera)
      shareride: 650, // nuestro precio promedio
    },
    marketSize: 2400000, // tamaño del mercado en pesos mensuales
  },

  // Métricas de satisfacción
  satisfaction: {
    passengerRating: 4.6,
    driverRating: 4.8,
    supportResponseTime: 1.2, // horas promedio
    complaintRate: 0.8, // porcentaje
    repeatUsage: 76, // porcentaje de usuarios que usan más de una vez
    recommendationRate: 82, // porcentaje que recomendaría la app
  },

  // Datos ambientales y sociales
  impact: {
    co2Reduction: 1250, // kg CO2 ahorrados por mes por viajes compartidos
    sharedRidesPercentage: 35,
    averageOccupancy: 2.3, // personas por viaje
    emptyKilometersReduced: 8900, // km mensuales
    economicImpactDrivers: 185000, // ingresos extra mensuales para conductores
  },

  // Tecnología y operaciones
  operations: {
    appDownloads: 3200,
    averageSessionTime: 8.5, // minutos
    crashRate: 0.02, // porcentaje
    supportTickets: 45, // por mes
    systemUptime: 99.7, // porcentaje
    averageMatchTime: 2.1, // minutos para encontrar conductor
  }
};

// Datos históricos mensuales para gráficos
export const monthlyData = [
  { month: 'Enero', users: 120, rides: 450, revenue: 156000 },
  { month: 'Febrero', users: 180, rides: 680, revenue: 234000 },
  { month: 'Marzo', users: 260, rides: 980, revenue: 342000 },
  { month: 'Abril', users: 380, rides: 1450, revenue: 478000 },
  { month: 'Mayo', users: 520, rides: 2100, revenue: 672000 },
  { month: 'Junio', users: 890, rides: 3200, revenue: 892000 },
];

// Datos de uso por día de la semana
export const weeklyUsageData = [
  { day: 'Lunes', rides: 165, drivers: 42 },
  { day: 'Martes', rides: 148, drivers: 38 },
  { day: 'Miércoles', rides: 172, drivers: 45 },
  { day: 'Jueves', rides: 189, drivers: 48 },
  { day: 'Viernes', rides: 225, drivers: 52 },
  { day: 'Sábado', rides: 198, drivers: 35 },
  { day: 'Domingo', rides: 142, drivers: 28 },
];

// Datos de uso por hora (día típico)
export const hourlyUsageData = [
  { hour: '06:00', rides: 12 },
  { hour: '07:00', rides: 28 },
  { hour: '08:00', rides: 45 },
  { hour: '09:00', rides: 32 },
  { hour: '10:00', rides: 18 },
  { hour: '11:00', rides: 22 },
  { hour: '12:00', rides: 35 },
  { hour: '13:00', rides: 28 },
  { hour: '14:00', rides: 25 },
  { hour: '15:00', rides: 20 },
  { hour: '16:00', rides: 26 },
  { hour: '17:00', rides: 38 },
  { hour: '18:00', rides: 52 },
  { hour: '19:00', rides: 48 },
  { hour: '20:00', rides: 35 },
  { hour: '21:00', rides: 22 },
  { hour: '22:00', rides: 15 },
  { hour: '23:00', rides: 8 },
];

export default demoStats;

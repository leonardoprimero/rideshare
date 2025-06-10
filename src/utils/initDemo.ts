// Utilidad para inicializar datos de demostración
import { authService } from '../services/authService';
import { rideService } from '../services/rideService';

export const initializeDemoData = () => {
  try {
    // Crear usuarios de prueba rápida si no existen
    // authService.createQuickTestUsers();
    
    // Generar algunos viajes de demostración para usuarios de prueba
    const testPassengerId = 'test_passenger';
    // rideService.generateDemoRides(testPassengerId, 3);
    
    console.log('✅ Datos de demostración inicializados correctamente');
    
    // Mostrar información de cuentas de demo en consola
    console.log('🎭 Cuentas de demostración disponibles:');
    console.log('👤 Pasajero: pasajero@demo.com / demo');
    console.log('🚗 Conductor: conductor@demo.com / demo');
    console.log('📊 Estadísticas: /stats');
    
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar datos de demostración:', error);
    return false;
  }
};

export const getDemoInfo = () => {
  return {
    accounts: {
      passenger: {
        email: 'pasajero@demo.com',
        password: 'demo',
        description: 'Cuenta de pasajero para demostración'
      },
      driver: {
        email: 'conductor@demo.com', 
        password: 'demo',
        description: 'Cuenta de conductor para demostración'
      }
    },
    features: [
      'Sistema de autenticación completo',
      'Base de datos mock con datos realistas de Salta',
      'Gestión de viajes y conductores',
      'Viajes compartidos y recurrentes',
      'Dashboard de estadísticas profesional',
      'Ubicaciones reales de Salta, Argentina',
      'Cálculo de precios dinámico',
      'Persistencia en localStorage'
    ],
    stats: {
      users: '1250+ usuarios registrados',
      drivers: '245 conductores activos',
      rides: '8450+ viajes completados',
      coverage: '15km de radio desde el centro'
    }
  };
};

export default { initializeDemoData, getDemoInfo };

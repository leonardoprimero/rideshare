import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, WEEK_DAYS } from '../../constants';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import '../../styles/passenger/SharedRidesPage.css';

// Datos simulados de viajes compartidos disponibles
const mockSharedRides = [
  {
    id: 'ride1',
    driverId: 'driver1',
    driverName: 'Carlos Rodríguez',
    driverRating: 4.8,
    origin: { lat: 19.4326, lng: -99.1332, name: '20 de Febrero' },
    destination: { lat: 19.3587, lng: -99.2650, name: 'Parque Industrial' },
    departureTime: '08:30',
    arrivalTime: '09:15',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    availableSeats: 3,
    pricePerSeat: 60,
    vehicleModel: 'Honda Civic 2022',
    vehicleColor: 'Blanco',
    vehiclePlate: 'ABC-123',
  },
  {
    id: 'ride2',
    driverId: 'driver2',
    driverName: 'Ana Martínez',
    driverRating: 4.9,
    origin: { lat: 19.4361, lng: -99.1400, name: 'Pinares' },
    destination: { lat: 19.3587, lng: -99.2650, name: 'Parque Industrial' },
    departureTime: '08:45',
    arrivalTime: '09:30',
    days: ['monday', 'wednesday', 'friday'],
    availableSeats: 2,
    pricePerSeat: 70,
    vehicleModel: 'Toyota Corolla 2021',
    vehicleColor: 'Gris',
    vehiclePlate: 'XYZ-789',
  },
  {
    id: 'ride3',
    driverId: 'driver3',
    driverName: 'Miguel Sánchez',
    driverRating: 4.7,
    origin: { lat: 19.4128, lng: -99.1673, name: 'Santa Lucía' },
    destination: { lat: 19.3587, lng: -99.2650, name: 'Libertad' },
    departureTime: '08:15',
    arrivalTime: '09:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    availableSeats: 4,
    pricePerSeat: 55,
    vehicleModel: 'Nissan Sentra 2020',
    vehicleColor: 'Azul',
    vehiclePlate: 'DEF-456',
  },
];

// Datos simulados de mis viajes compartidos
const mockMySharedRides = [
  {
    id: 'myride1',
    driverId: 'driver1',
    driverName: 'Carlos Rodríguez',
    driverRating: 4.8,
    origin: { lat: 19.4326, lng: -99.1332, name: 'Castañares' },
    destination: { lat: 19.3587, lng: -99.2650, name: 'Hogar Escuela' },
    departureTime: '08:30',
    arrivalTime: '09:15',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    status: 'active',
    nextRideDate: '2023-06-05',
    pricePerSeat: 60,
  },
];

const SharedRidesPage: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Estados para la página de viajes compartidos
  const [activeTab, setActiveTab] = useState('available');
  const [selectedRide, setSelectedRide] = useState<typeof mockSharedRides[0] | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isJoiningRide, setIsJoiningRide] = useState(false);
  
  // Inicializar el mapa cuando se carga el componente
  useEffect(() => {
    if (mapRef.current && !isMapLoaded) {
      // Simulamos la inicialización del mapa
      console.log('Mapa inicializado para viajes compartidos');
      setIsMapLoaded(true);
      
      // En una implementación real, inicializaríamos Google Maps aquí
    }
  }, []);
  
  // Función para seleccionar un viaje
  const handleSelectRide = (ride: typeof mockSharedRides[0]) => {
    setSelectedRide(ride);
    
    // En una implementación real, actualizaríamos el mapa para mostrar la ruta
  };
  
  // Función para unirse a un viaje compartido
  const handleJoinRide = () => {
    if (!selectedRide) return;
    
    setIsJoiningRide(true);
    
    // Simulamos el proceso de unirse al viaje
    setTimeout(() => {
      // En una implementación real, enviaríamos la solicitud al backend
      
      // Cambiar a la pestaña "Mis viajes"
      setActiveTab('my-rides');
      setIsJoiningRide(false);
      
      // Limpiar la selección
      setSelectedRide(null);
    }, 2000);
  };
  
  // Función para cancelar un viaje compartido
  const handleCancelRide = (rideId: string) => {
    // En una implementación real, enviaríamos la solicitud al backend
    console.log('Cancelando viaje:', rideId);
    
    // Simulamos la cancelación
    alert('Viaje cancelado correctamente');
  };
  
  // Función para volver a la página anterior
  const handleBack = () => {
    navigate(ROUTES.PASSENGER.HOME);
  };
  
  // Función para formatear los días de la semana
  const formatDays = (days: string[]) => {
    if (days.length === 5 && 
        days.includes('monday') && 
        days.includes('tuesday') && 
        days.includes('wednesday') && 
        days.includes('thursday') && 
        days.includes('friday')) {
      return 'Lunes a Viernes';
    }
    
    return days.map(day => {
      const dayObj = WEEK_DAYS.find(d => d.id === day);
      return dayObj ? dayObj.name : day;
    }).join(', ');
  };
  
  return (
    <div className="shared-rides-container">
      <header className="shared-rides-header">
        <Button 
          variant="ghost" 
          className="back-button" 
          onClick={handleBack}
        >
          ←
        </Button>
        <h1 className="header-title">Viajes Compartidos</h1>
      </header>
      
      <main className="shared-rides-main">
        <Tabs 
          defaultValue="available" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="tabs-container"
        >
          <TabsList className="tabs-list">
            <TabsTrigger value="available" className="tab">Disponibles</TabsTrigger>
            <TabsTrigger value="my-rides" className="tab">Mis Viajes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="tab-content">
            <div className="rides-list-container">
              <div className="rides-list">
                {mockSharedRides.map((ride) => (
                  <div 
                    key={ride.id} 
                    className={`ride-card ${selectedRide?.id === ride.id ? 'selected' : ''}`}
                    onClick={() => handleSelectRide(ride)}
                  >
                    <div className="ride-header">
                      <div className="ride-time">{ride.departureTime}</div>
                      <div className="ride-price">${ride.pricePerSeat} ARS</div>
                    </div>
                    
                    <div className="ride-route">
                      <div className="route-point">
                        <div className="point-marker origin"></div>
                        <div className="point-name">{ride.origin.name}</div>
                      </div>
                      <div className="route-line"></div>
                      <div className="route-point">
                        <div className="point-marker destination"></div>
                        <div className="point-name">{ride.destination.name}</div>
                      </div>
                    </div>
                    
                    <div className="ride-details">
                      <div className="driver-info">
                        <div className="driver-avatar">
                          {ride.driverName.charAt(0)}
                        </div>
                        <div className="driver-details">
                          <div className="driver-name">{ride.driverName}</div>
                          <div className="driver-rating">★ {ride.driverRating}</div>
                        </div>
                      </div>
                      
                      <div className="ride-info">
                        <div className="info-item">
                          <span className="info-icon">🗓️</span>
                          <span className="info-text">{formatDays(ride.days)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">👥</span>
                          <span className="info-text">{ride.availableSeats} asientos disponibles</span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">🚗</span>
                          <span className="info-text">{ride.vehicleModel} ({ride.vehicleColor})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div 
                ref={mapRef} 
                className="map-container"
              >
                {/* El mapa de Google se renderizaría aquí en una implementación real */}
                <div className="simulated-map">
                  {selectedRide && (
                    <>
                      <div className="origin-marker" style={{ left: '30%', top: '50%' }}>
                        📍 {selectedRide.origin.name}
                      </div>
                      
                      <div className="destination-marker" style={{ left: '70%', top: '30%' }}>
                        📍 {selectedRide.destination.name}
                      </div>
                      
                      <div className="route-line"></div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {selectedRide && (
              <div className="ride-action-panel">
                <Card>
                  <CardContent className="action-content">
                    <div className="selected-ride-summary">
                      <div className="summary-route">
                        <div className="summary-origin">{selectedRide.origin.name}</div>
                        <div className="summary-arrow">→</div>
                        <div className="summary-destination">{selectedRide.destination.name}</div>
                      </div>
                      
                      <div className="summary-details">
                        <div className="summary-time">
                          <span className="detail-label">Salida:</span>
                          <span className="detail-value">{selectedRide.departureTime}</span>
                        </div>
                        <div className="summary-days">
                          <span className="detail-label">Días:</span>
                          <span className="detail-value">{formatDays(selectedRide.days)}</span>
                        </div>
                        <div className="summary-price">
                          <span className="detail-label">Precio:</span>
                          <span className="detail-value">${selectedRide.pricePerSeat} ARS</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="join-button" 
                      onClick={handleJoinRide}
                      disabled={isJoiningRide}
                    >
                      {isJoiningRide ? 'Procesando...' : 'Unirme a este viaje'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-rides" className="tab-content">
            {mockMySharedRides.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🚗</div>
                <h3 className="empty-title">No tienes viajes compartidos</h3>
                <p className="empty-description">
                  Únete a un viaje compartido para verlo aquí
                </p>
                <Button 
                  onClick={() => setActiveTab('available')}
                  className="empty-action"
                >
                  Explorar viajes disponibles
                </Button>
              </div>
            ) : (
              <div className="my-rides-list">
                {mockMySharedRides.map((ride) => (
                  <Card key={ride.id} className="my-ride-card">
                    <CardHeader>
                      <CardTitle className="my-ride-title">
                        {ride.origin.name} → {ride.destination.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="my-ride-details">
                        <div className="detail-row">
                          <span className="detail-label">Conductor:</span>
                          <span className="detail-value">{ride.driverName} (★ {ride.driverRating})</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Horario:</span>
                          <span className="detail-value">{ride.departureTime} - {ride.arrivalTime}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Días:</span>
                          <span className="detail-value">{formatDays(ride.days)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Precio:</span>
                          <span className="detail-value">${ride.pricePerSeat} ARS</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Estado:</span>
                          <span className="detail-value status-active">Activo</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Próximo viaje:</span>
                          <span className="detail-value">Lunes 5 de junio, 2023</span>
                        </div>
                      </div>
                      
                      <div className="my-ride-actions">
                        <Button 
                          variant="outline" 
                          className="action-button"
                          onClick={() => handleCancelRide(ride.id)}
                        >
                          Cancelar viaje
                        </Button>
                        <Button className="action-button">
                          Contactar conductor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SharedRidesPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import MapComponent from '../../components/maps/MapComponent';
import useGoogleMaps from '../../hooks/useGoogleMaps';

import { useRides } from '../../hooks/useRides';
import { ROUTES } from '../../constants';
import { saltaLocations } from '../../data/mockData';
import '../../styles/passenger/SharedRidesPage.css';

const SharedRidesPage: React.FC = () => {
  const navigate = useNavigate();
  const { joinSharedRide } = useRides();
  
  // Estados locales
  const [activeTab, setActiveTab] = useState('available');
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    departureTime: 'any',
    seats: 1
  });
  const [showFilters, setShowFilters] = useState(false);

  // Hook de Google Maps
  const {
    center,
    zoom,
    markers,
    isLoading: mapLoading,
    error: mapError,
    addMarker,
    clearMarkers
  } = useGoogleMaps({
    enableGeolocation: true,
    autoCenter: true
  });

  // Datos mock de viajes compartidos
  const mockSharedRides = [
    {
      id: 'shared1',
      driverId: 'driver1',
      driverName: 'Carlos Mendoza',
      driverRating: 4.8,
      driverTrips: 127,
      origin: saltaLocations.plazaJulio,
      destination: saltaLocations.shoppingAltaNoa,
      departureTime: '08:30',
      arrivalTime: '08:45',
      days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
      availableSeats: 3,
      totalSeats: 4,
      pricePerSeat: 180,
      vehicleModel: 'Honda Civic 2022',
      vehicleColor: 'Blanco',
      vehiclePlate: 'SAL-123',
      isRegular: true,
      features: ['AC', 'Música', 'No fumar']
    },
    {
      id: 'shared2',
      driverId: 'driver2',
      driverName: 'Ana López',
      driverRating: 4.9,
      driverTrips: 203,
      origin: saltaLocations.universidadNacional,
      destination: saltaLocations.hospitalDelMilagro,
      departureTime: '07:15',
      arrivalTime: '07:30',
      days: ['Lun', 'Mié', 'Vie'],
      availableSeats: 2,
      totalSeats: 4,
      pricePerSeat: 150,
      vehicleModel: 'Toyota Corolla 2021',
      vehicleColor: 'Gris',
      vehiclePlate: 'SAL-456',
      isRegular: true,
      features: ['AC', 'WiFi', 'No fumar']
    },
    {
      id: 'shared3',
      driverId: 'driver3',
      driverName: 'Roberto Silva',
      driverRating: 4.7,
      driverTrips: 89,
      origin: saltaLocations.terminalOmnibus,
      destination: saltaLocations.aeropuerto,
      departureTime: '06:00',
      arrivalTime: '06:25',
      days: ['Mar', 'Jue', 'Sáb'],
      availableSeats: 1,
      totalSeats: 3,
      pricePerSeat: 220,
      vehicleModel: 'Nissan Sentra 2020',
      vehicleColor: 'Azul',
      vehiclePlate: 'SAL-789',
      isRegular: false,
      features: ['AC', 'No mascotas']
    }
  ];

  // Mis viajes compartidos reservados
  const mySharedRides = [
    {
      ...mockSharedRides[0],
      id: 'my1',
      reservedSeats: 1,
      status: 'confirmed',
      nextRide: '2024-01-15 08:30:00'
    }
  ];

  // Actualizar marcadores cuando cambie el viaje seleccionado
  useEffect(() => {
    if (selectedRide) {
      clearMarkers();
      
      addMarker({
        id: 'origin',
        location: selectedRide.origin,
        type: 'origin',
        label: `Origen: ${selectedRide.origin.name}`
      });
      
      addMarker({
        id: 'destination',
        location: selectedRide.destination,
        type: 'destination',
        label: `Destino: ${selectedRide.destination.name}`
      });
    }
  }, [selectedRide]);

  // Filtrar viajes disponibles
  const filteredRides = mockSharedRides.filter(ride => {
    if (filters.priceRange && (ride.pricePerSeat < filters.priceRange[0] || ride.pricePerSeat > filters.priceRange[1])) {
      return false;
    }
    if (filters.seats && ride.availableSeats < filters.seats) {
      return false;
    }
    return true;
  });

  const handleJoinRide = async (rideId: string) => {
    try {
      await joinSharedRide(rideId, 'passenger-demo'); // Reservar en viaje compartido
      navigate('/passenger/shared-confirmation', {
        state: { rideId }
      });
    } catch (error) {
      console.error('Error al unirse al viaje:', error);
    }
  };

  const handleViewRideDetails = (ride: any) => {
    setSelectedRide(ride);
  };

  const formatDays = (days: string[]) => {
    return days.join(', ');
  };

  const calculateOccupancy = (available: number, total: number) => {
    return ((total - available) / total) * 100;
  };

  const getTimeOfDay = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 6) return 'Madrugada';
    if (hour < 12) return 'Mañana';
    if (hour < 18) return 'Tarde';
    return 'Noche';
  };

  return (
    <div className="shared-rides-container">
      {/* Header */}
      <header className="shared-header">
        <div className="header-content">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.PASSENGER.HOME)}
            className="back-button"
          >
            ← Atrás
          </Button>
          <h1 className="page-title">Viajes compartidos</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="filter-button"
          >
            Filtros
          </Button>
        </div>
      </header>

      {/* Filtros */}
      {showFilters && (
        <div className="filters-panel">
          <Card>
            <CardHeader>
              <CardTitle>Filtrar viajes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Precio máximo por asiento</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [0, parseInt(e.target.value)]
                    }))}
                  />
                  <span>${filters.priceRange[1]}</span>
                </div>
                
                <div className="filter-group">
                  <label>Asientos necesarios</label>
                  <select
                    value={filters.seats}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      seats: parseInt(e.target.value)
                    }))}
                  >
                    <option value={1}>1 asiento</option>
                    <option value={2}>2 asientos</option>
                    <option value={3}>3 asientos</option>
                    <option value={4}>4 asientos</option>
                  </select>
                </div>
              </div>
              
              <Button
                onClick={() => setShowFilters(false)}
                className="apply-filters-button"
              >
                Aplicar filtros
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs principales */}
      <div className="content-section">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="tabs-list">
            <TabsTrigger value="available">Disponibles ({filteredRides.length})</TabsTrigger>
            <TabsTrigger value="my-rides">Mis viajes ({mySharedRides.length})</TabsTrigger>
            <TabsTrigger value="create">Crear viaje</TabsTrigger>
          </TabsList>

          {/* Viajes disponibles */}
          <TabsContent value="available" className="tab-content">
            {selectedRide && (
              <div className="selected-ride-preview">
                <div className="map-preview">
                  <MapComponent
                    center={center}
                    zoom={zoom}
                    markers={markers}
                    isLoading={mapLoading}
                    error={mapError}
                    className="preview-map"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRide(null)}
                  className="close-preview"
                >
                  ✕ Cerrar vista previa
                </Button>
              </div>
            )}

            <div className="rides-list">
              {filteredRides.length === 0 ? (
                <div className="empty-state">
                  <Card>
                    <CardContent className="empty-content">
                      <div className="empty-icon">🚗</div>
                      <h3>No hay viajes disponibles</h3>
                      <p>Ajusta los filtros o crea tu propio viaje compartido</p>
                      <Button onClick={() => setActiveTab('create')}>
                        Crear viaje
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredRides.map((ride) => (
                  <Card key={ride.id} className="ride-card">
                    <CardHeader className="ride-header">
                      <div className="ride-title-section">
                        <div className="driver-info">
                          <div className="driver-avatar">
                            {ride.driverName.charAt(0)}
                          </div>
                          <div className="driver-details">
                            <h4>{ride.driverName}</h4>
                            <p>⭐ {ride.driverRating} • {ride.driverTrips} viajes</p>
                          </div>
                        </div>
                        <div className="ride-badges">
                          {ride.isRegular && <Badge>Regular</Badge>}
                          <Badge variant="outline">{getTimeOfDay(ride.departureTime)}</Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="ride-content">
                      {/* Ruta */}
                      <div className="route-section">
                        <div className="route-point">
                          <div className="route-dot origin"></div>
                          <div className="route-info">
                            <h5>Origen • {ride.departureTime}</h5>
                            <p>{ride.origin.name}</p>
                          </div>
                        </div>
                        
                        <div className="route-line"></div>
                        
                        <div className="route-point">
                          <div className="route-dot destination"></div>
                          <div className="route-info">
                            <h5>Destino • {ride.arrivalTime}</h5>
                            <p>{ride.destination.name}</p>
                          </div>
                        </div>
                      </div>

                      {/* Detalles del viaje */}
                      <div className="ride-details">
                        <div className="detail-row">
                          <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <span className="detail-text">{formatDays(ride.days)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">🚗</span>
                            <span className="detail-text">{ride.vehicleModel}</span>
                          </div>
                        </div>
                        
                        <div className="detail-row">
                          <div className="detail-item">
                            <span className="detail-icon">💺</span>
                            <span className="detail-text">
                              {ride.availableSeats} de {ride.totalSeats} disponibles
                            </span>
                          </div>
                          <div className="detail-item price">
                            <span className="detail-icon">💰</span>
                            <span className="detail-text price-amount">${ride.pricePerSeat}/persona</span>
                          </div>
                        </div>
                      </div>

                      {/* Ocupación visual */}
                      <div className="occupancy-section">
                        <div className="occupancy-info">
                          <span>Ocupación</span>
                          <span>{ride.totalSeats - ride.availableSeats}/{ride.totalSeats}</span>
                        </div>
                        <Progress 
                          value={calculateOccupancy(ride.availableSeats, ride.totalSeats)} 
                          className="occupancy-bar"
                        />
                      </div>

                      {/* Características */}
                      <div className="features-section">
                        {ride.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="feature-badge">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Acciones */}
                      <div className="ride-actions">
                        <Button
                          variant="outline"
                          onClick={() => handleViewRideDetails(ride)}
                        >
                          Ver en mapa
                        </Button>
                        <Button
                          onClick={() => handleJoinRide(ride.id)}
                          disabled={ride.availableSeats === 0}
                        >
                          {ride.availableSeats === 0 ? 'Completo' : `Unirse $${ride.pricePerSeat}`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Mis viajes compartidos */}
          <TabsContent value="my-rides" className="tab-content">
            <div className="my-rides-list">
              {mySharedRides.length === 0 ? (
                <div className="empty-state">
                  <Card>
                    <CardContent className="empty-content">
                      <div className="empty-icon">📝</div>
                      <h3>No tienes viajes compartidos</h3>
                      <p>Únete a un viaje existente o crea uno nuevo</p>
                      <Button onClick={() => setActiveTab('available')}>
                        Explorar viajes
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                mySharedRides.map((ride) => (
                  <Card key={ride.id} className="my-ride-card">
                    <CardHeader>
                      <div className="my-ride-header">
                        <CardTitle>Próximo viaje</CardTitle>
                        <Badge className="status-badge">{ride.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Similar estructura pero con información de reserva */}
                      <div className="route-section">
                        <div className="route-point">
                          <div className="route-dot origin"></div>
                          <div className="route-info">
                            <h5>Origen • {ride.departureTime}</h5>
                            <p>{ride.origin.name}</p>
                          </div>
                        </div>
                        
                        <div className="route-line"></div>
                        
                        <div className="route-point">
                          <div className="route-dot destination"></div>
                          <div className="route-info">
                            <h5>Destino • {ride.arrivalTime}</h5>
                            <p>{ride.destination.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="reservation-info">
                        <div className="info-item">
                          <span>Conductor:</span>
                          <span>{ride.driverName}</span>
                        </div>
                        <div className="info-item">
                          <span>Asientos reservados:</span>
                          <span>{ride.reservedSeats}</span>
                        </div>
                        <div className="info-item">
                          <span>Total a pagar:</span>
                          <span>${ride.pricePerSeat * ride.reservedSeats}</span>
                        </div>
                      </div>

                      <div className="my-ride-actions">
                        <Button variant="outline">Contactar conductor</Button>
                        <Button variant="destructive">Cancelar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Crear viaje */}
          <TabsContent value="create" className="tab-content">
            <Card>
              <CardHeader>
                <CardTitle>Crear viaje compartido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="create-form">
                  <p className="coming-soon">
                    🚧 Función en desarrollo
                  </p>
                  <p>
                    Pronto podrás crear tus propios viajes compartidos y conectar con otros pasajeros.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('available')}
                  >
                    Explorar viajes disponibles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer navigation */}
      <footer className="shared-footer">
        <div className="footer-nav">
          <Button 
            variant="ghost" 
            className="nav-item"
            onClick={() => navigate(ROUTES.PASSENGER.HOME)}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="nav-item active"
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Compartidos</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="nav-item"
            onClick={() => navigate('/passenger/history')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Historial</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="nav-item"
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Perfil</span>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default SharedRidesPage;

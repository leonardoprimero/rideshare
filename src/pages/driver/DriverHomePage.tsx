import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Progress } from '../../components/ui/progress';
import MapComponent from '../../components/maps/MapComponent';
import useGoogleMaps from '../../hooks/useGoogleMaps';
import { useAuth } from '../../hooks/useAuth';

import { ROUTES } from '../../constants';
import { saltaLocations } from '../../data/mockData';
import '../../styles/driver/DriverHomePage.css';

// Componente para la página principal del conductor
const DriverHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  
  // Estados locales
  const [isAvailable, setIsAvailable] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({
    trips: 0,
    earnings: 0,
    hoursOnline: 0,
    rating: 4.9
  });
  const [weeklyGoal] = useState(2500); // Objetivo semanal
  const [weeklyProgress, setWeeklyProgress] = useState(1850); // Progreso actual

  // Hook de Google Maps
  const {
    center,
    zoom,
    markers,
    userLocation,
    isLoading: mapLoading,
    error: mapError,
    addMarker,
    clearMarkers,
    addNearbyDrivers,
    initializeUserLocation
  } = useGoogleMaps({
    enableGeolocation: true,
    trackUserLocation: true,
    autoCenter: true
  });

  // Inicializar ubicación
  useEffect(() => {
    initializeUserLocation();
  }, []);

  // Actualizar marcadores cuando cambie la disponibilidad
  useEffect(() => {
    if (userLocation) {
      clearMarkers();
      
      // Agregar marcador del conductor
      addMarker({
        id: 'driver-current',
        location: userLocation,
        type: 'driver',
        label: `${user?.name || 'Conductor'} - ${isAvailable ? 'Disponible' : 'No disponible'}`,
        data: { available: isAvailable }
      });

      // Si está disponible, mostrar clientes potenciales
      if (isAvailable) {
        addNearbyDrivers(userLocation, 5); // Simular 5 solicitudes potenciales
      }
    }
  }, [userLocation, isAvailable]);

  // Simular solicitudes de viaje cuando está disponible
  useEffect(() => {
    let requestTimer: NodeJS.Timeout;
    
    if (isAvailable) {
      requestTimer = setTimeout(() => {
        generateRandomRequest();
      }, Math.random() * 8000 + 5000); // Entre 5-13 segundos
    }
    
    return () => clearTimeout(requestTimer);
  }, [isAvailable, pendingRequests.length]);

  // Simular estadísticas del día
  useEffect(() => {
    const statInterval = setInterval(() => {
      if (isAvailable) {
        setTodayStats(prev => ({
          ...prev,
          hoursOnline: prev.hoursOnline + 0.017 // Incrementa aproximadamente cada minuto
        }));
      }
    }, 60000); // Cada minuto

    return () => clearInterval(statInterval);
  }, [isAvailable]);

  const generateRandomRequest = () => {
    if (!isAvailable || pendingRequests.length >= 2) return;
    
    const locations = Object.values(saltaLocations);
    const origin = locations[Math.floor(Math.random() * locations.length)];
    const destination = locations[Math.floor(Math.random() * locations.length)];
    
    if (origin === destination) return;
    
    const distance = Math.floor(Math.random() * 8) + 2; // 2-10 km
    const basePrice = distance * 150; // $150 por km base
    const finalPrice = Math.floor(basePrice * (0.8 + Math.random() * 0.4)); // Variación del precio
    
    const newRequest = {
      id: `request-${Date.now()}`,
      passenger: {
        id: `passenger-${Math.random()}`,
        name: ['Ana López', 'Carlos Mendoza', 'María García', 'Luis Rodríguez', 'Laura Fernández'][Math.floor(Math.random() * 5)],
        rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
        trips: Math.floor(Math.random() * 100) + 10
      },
      pickup: origin,
      destination: destination,
      estimatedPrice: finalPrice,
      estimatedDistance: distance,
      estimatedDuration: Math.floor(distance * 2.5 + Math.random() * 5), // Aproximado
      requestTime: new Date(),
      urgency: Math.random() > 0.7 ? 'high' : 'normal',
      vehicleType: ['economy', 'comfort', 'premium'][Math.floor(Math.random() * 3)]
    };
    
    setPendingRequests(prev => [...prev, newRequest]);
    
    // Auto-remover después de 30 segundos si no se acepta
    setTimeout(() => {
      setPendingRequests(prev => prev.filter(req => req.id !== newRequest.id));
    }, 30000);
  };

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
    
    if (isAvailable) {
      setPendingRequests([]);
    }
  };

  const handleAcceptRequest = (request: any) => {
    // Actualizar estadísticas
    setTodayStats(prev => ({
      ...prev,
      trips: prev.trips + 1,
      earnings: prev.earnings + request.estimatedPrice
    }));
    
    setWeeklyProgress(prev => prev + request.estimatedPrice);
    
    // Remover solicitud
    setPendingRequests(prev => prev.filter(req => req.id !== request.id));
    
    // Navegar a pantalla de viaje activo
    navigate('/driver/active-ride', {
      state: {
        request,
        acceptedAt: new Date()
      }
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'economy': return '🚗';
      case 'comfort': return '🚙';
      case 'premium': return '🚘';
      default: return '🚗';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="driver-home-container">
      {/* Header moderno */}
      <header className="driver-header">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="brand-title">ShareRide</h1>
            <Badge variant="secondary" className="driver-badge">
              🚗 Conductor
            </Badge>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="greeting">Hola,</span>
              <span className="user-name">{user?.name?.split(' ')[0] || 'Conductor'}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="logout-button"
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Mapa interactivo */}
      <div className="map-section">
        <MapComponent
          center={center}
          zoom={zoom}
          markers={markers}
          isLoading={mapLoading}
          error={mapError}
          className="driver-map"
        />
        
        {/* Control de disponibilidad overlay */}
        <div className="availability-overlay">
          <Card className="availability-card">
            <CardContent className="availability-content">
              <div className="availability-control">
                <div className="availability-info">
                  <span className={`status-indicator ${isAvailable ? 'online' : 'offline'}`}>
                    {isAvailable ? '🟢' : '🔴'}
                  </span>
                  <span className="status-text">
                    {isAvailable ? 'En línea' : 'Desconectado'}
                  </span>
                </div>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={handleToggleAvailability}
                  className="availability-switch"
                />
              </div>
              {isAvailable && (
                <div className="online-stats">
                  <span className="online-time">⏱️ {todayStats.hoursOnline.toFixed(1)}h en línea</span>
                  <span className="requests-count">📋 {pendingRequests.length} solicitudes</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Estadísticas del día */}
      <div className="stats-section">
        <div className="stats-grid">
          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-icon">🚗</div>
              <div className="stat-info">
                <h4>{todayStats.trips}</h4>
                <p>Viajes hoy</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h4>${todayStats.earnings}</h4>
                <p>Ganado hoy</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="stat-card">
            <CardContent className="stat-content">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h4>{todayStats.rating}</h4>
                <p>Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Objetivo semanal */}
      <div className="goal-section">
        <Card>
          <CardHeader>
            <CardTitle className="goal-title">Objetivo semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="goal-progress">
              <div className="goal-amounts">
                <span className="current-amount">${weeklyProgress}</span>
                <span className="goal-amount">/ ${weeklyGoal}</span>
              </div>
              <Progress 
                value={(weeklyProgress / weeklyGoal) * 100} 
                className="goal-bar" 
              />
              <p className="goal-remaining">
                ${weeklyGoal - weeklyProgress} restantes para completar el objetivo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitudes de viaje */}
      {pendingRequests.length > 0 && (
        <div className="requests-section">
          <h3 className="requests-title">
            Nuevas solicitudes ({pendingRequests.length})
          </h3>
          <div className="requests-list">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="request-card">
                <CardContent className="request-content">
                  {/* Header de la solicitud */}
                  <div className="request-header">
                    <div className="passenger-info">
                      <div className="passenger-avatar">
                        {request.passenger.name.charAt(0)}
                      </div>
                      <div className="passenger-details">
                        <h4>{request.passenger.name}</h4>
                        <p>⭐ {request.passenger.rating} • {request.passenger.trips} viajes</p>
                      </div>
                    </div>
                    <div className="request-badges">
                      {request.urgency === 'high' && (
                        <Badge variant="destructive">Urgente</Badge>
                      )}
                      <Badge variant="outline">
                        {getVehicleTypeIcon(request.vehicleType)} {request.vehicleType}
                      </Badge>
                    </div>
                  </div>

                  {/* Ruta */}
                  <div className="request-route">
                    <div className="route-point">
                      <div className="route-dot pickup"></div>
                      <div className="route-info">
                        <h5>Recogida</h5>
                        <p>{request.pickup.name}</p>
                      </div>
                    </div>
                    <div className="route-line"></div>
                    <div className="route-point">
                      <div className="route-dot dropoff"></div>
                      <div className="route-info">
                        <h5>Destino</h5>
                        <p>{request.destination.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del viaje */}
                  <div className="request-details">
                    <div className="detail-item">
                      <span className="detail-icon">📏</span>
                      <span className="detail-text">{request.estimatedDistance} km</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">⏱️</span>
                      <span className="detail-text">{request.estimatedDuration} min</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🕐</span>
                      <span className="detail-text">{formatTime(request.requestTime)}</span>
                    </div>
                    <div className="detail-item price">
                      <span className="detail-icon">💰</span>
                      <span className="detail-text price-amount">${request.estimatedPrice}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="request-actions">
                    <Button
                      variant="outline"
                      onClick={() => handleRejectRequest(request.id)}
                      className="reject-button"
                    >
                      Rechazar
                    </Button>
                    <Button
                      onClick={() => handleAcceptRequest(request)}
                      className="accept-button"
                    >
                      Aceptar ${request.estimatedPrice}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No hay solicitudes */}
      {isAvailable && pendingRequests.length === 0 && (
        <div className="no-requests-section">
          <Card>
            <CardContent className="no-requests-content">
              <div className="no-requests-icon">📍</div>
              <h3>Esperando solicitudes...</h3>
              <p>Mantente cerca de zonas con alta demanda para recibir más viajes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Opciones rápidas */}
      <div className="quick-actions-section">
        <div className="actions-grid">
          <Card className="action-card" onClick={() => navigate(ROUTES.DRIVER.RECURRING_RIDES)}>
            <CardContent className="action-content">
              <div className="action-icon">🔄</div>
              <div className="action-text">
                <h4>Viajes recurrentes</h4>
                <p>Gestiona tus rutas habituales</p>
              </div>
            </CardContent>
          </Card>

          <Card className="action-card" onClick={() => navigate('/driver/earnings')}>
            <CardContent className="action-content">
              <div className="action-icon">📊</div>
              <div className="action-text">
                <h4>Ganancias</h4>
                <p>Revisa tus ingresos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="action-card" onClick={() => navigate('/driver/history')}>
            <CardContent className="action-content">
              <div className="action-icon">📋</div>
              <div className="action-text">
                <h4>Historial</h4>
                <p>Viajes realizados</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer navigation */}
      <footer className="driver-footer">
        <div className="footer-nav">
          <Button 
            variant="ghost" 
            className="nav-item active"
            onClick={() => navigate(ROUTES.DRIVER.HOME)}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="nav-item"
            onClick={() => navigate('/driver/requests')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Solicitudes</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="nav-item"
            onClick={() => navigate('/driver/earnings')}
          >
            <span className="nav-icon">💰</span>
            <span className="nav-text">Ganancias</span>
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

export default DriverHomePage;

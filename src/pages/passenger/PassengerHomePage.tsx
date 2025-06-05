import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import MapComponent from '../../components/maps/MapComponent';
import useGoogleMaps from '../../hooks/useGoogleMaps';
import { useAuth } from '../../hooks/useAuth';
import { useRides } from '../../hooks/useRides';
import { saltaLocations } from '../../data/mockData';
import '../../styles/passenger/PassengerHomePage.css';

// Componente para la página principal del pasajero
const PassengerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { nearbyDrivers, rideHistory, currentRide, findNearbyDrivers } = useRides();
  
  // Estados locales
  const [recentDestinations] = useState([
    saltaLocations.shoppingAltaNoa,
    saltaLocations.universidadNacional,
    saltaLocations.aeropuerto
  ]);

  // Hook de Google Maps
  const {
    center,
    zoom,
    userLocation,
    markers,
    isLoading: mapLoading,
    error: mapError,
    addNearbyDrivers,
    initializeUserLocation
  } = useGoogleMaps({
    enableGeolocation: true,
    trackUserLocation: true,
    autoCenter: true
  });

  // Inicializar ubicación y conductores cercanos
  useEffect(() => {
    const initializeHome = async () => {
      await initializeUserLocation();
      if (userLocation) {
        await findNearbyDrivers(userLocation);
        addNearbyDrivers(userLocation, 8); // 8 conductores para demo visual
      }
    };
    
    initializeHome();
  }, []);

  // Actualizar marcadores cuando cambien los conductores cercanos
  useEffect(() => {
    if (userLocation && nearbyDrivers.length > 0) {
      addNearbyDrivers(userLocation, nearbyDrivers.length);
    }
  }, [nearbyDrivers, userLocation]);
  
  const handleSearchPress = () => {
    navigate(ROUTES.PASSENGER.SEARCH_DESTINATION);
  };
  
  const handleScheduleRidePress = () => {
    navigate(ROUTES.PASSENGER.SEARCH_DESTINATION, { 
      state: { scheduled: true } 
    });
  };
  
  const handleSharedRidesPress = () => {
    navigate(ROUTES.PASSENGER.SHARED_RIDES);
  };

  const handleQuickDestination = (destination: any) => {
    navigate(ROUTES.PASSENGER.RIDE_REQUEST, {
      state: {
        origin: userLocation || saltaLocations.plazaJulio,
        destination: destination
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="passenger-home-container">
      {/* Header mejorado */}
      <header className="passenger-header">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="brand-title">ShareRide</h1>
            <Badge variant="secondary" className="location-badge">
              📍 Salta
            </Badge>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="greeting">Hola,</span>
              <span className="user-name">{user?.name?.split(' ')[0] || 'Usuario'}</span>
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
          className="home-map"
        />
        
        {/* Overlay de información */}
        <div className="map-overlay">
          <Card className="status-card">
            <CardContent className="status-content">
              <div className="status-item">
                <span className="status-icon">🚗</span>
                <span className="status-text">{nearbyDrivers.length} conductores cerca</span>
              </div>
              {currentRide && (
                <div className="status-item">
                  <span className="status-icon">🎯</span>
                  <span className="status-text">Viaje en curso</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Barra de búsqueda principal */}
      <div className="search-section">
        <Button
          className="main-search-button"
          onClick={handleSearchPress}
          size="lg"
        >
          <span className="search-icon">🔍</span>
          <span className="search-text">¿A dónde quieres ir?</span>
          <span className="search-arrow">→</span>
        </Button>
      </div>

      {/* Destinos recientes */}
      <div className="recent-section">
        <h3 className="section-title">Destinos frecuentes</h3>
        <div className="recent-destinations">
          {recentDestinations.map((destination, index) => (
            <Button
              key={index}
              variant="outline"
              className="destination-button"
              onClick={() => handleQuickDestination(destination)}
            >
              <span className="destination-icon">📍</span>
              <span className="destination-name">{destination.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Opciones de viaje */}
      <div className="options-section">
        <div className="options-grid">
          <Card className="option-card" onClick={handleSearchPress}>
            <CardContent className="option-content">
              <div className="option-icon">🚕</div>
              <div className="option-text">
                <h4>Viaje inmediato</h4>
                <p>Encuentra un conductor ahora</p>
              </div>
              <div className="option-badge">
                <Badge>Rápido</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="option-card" onClick={handleScheduleRidePress}>
            <CardContent className="option-content">
              <div className="option-icon">🗓️</div>
              <div className="option-text">
                <h4>Programar viaje</h4>
                <p>Reserva con anticipación</p>
              </div>
              <div className="option-badge">
                <Badge variant="secondary">Próximamente</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="option-card" onClick={handleSharedRidesPress}>
            <CardContent className="option-content">
              <div className="option-icon">👥</div>
              <div className="option-text">
                <h4>Viajes compartidos</h4>
                <p>Ahorra compartiendo</p>
              </div>
              <div className="option-badge">
                <Badge variant="outline">-40%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resumen rápido */}
      {rideHistory.length > 0 && (
        <div className="summary-section">
          <Card>
            <CardHeader>
              <CardTitle className="summary-title">Tu actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-number">{rideHistory.length}</span>
                  <span className="stat-label">Viajes totales</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">⭐ Rating</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">$2,450</span>
                  <span className="stat-label">Ahorrado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation footer */}
      <footer className="passenger-footer">
        <div className="footer-nav">
          <Button 
            variant="ghost" 
            className="nav-item active"
            onClick={() => navigate(ROUTES.PASSENGER.HOME)}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="nav-item"
            onClick={() => navigate(ROUTES.PASSENGER.SHARED_RIDES)}
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

export default PassengerHomePage;

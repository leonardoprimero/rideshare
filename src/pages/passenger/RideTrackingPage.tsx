import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import MapComponent from '../../components/maps/MapComponent';
import RealTimeTracker from '../../components/maps/RealTimeTracker';
import useGoogleMaps from '../../hooks/useGoogleMaps';

import { ROUTES } from '../../constants';
import '../../styles/passenger/RideTrackingPage.css';

interface RideTrackingState {
  rideId: string;
  driver: any;
  origin: any;
  destination: any;
  vehicleType: string;
  price: number;
}

const RideTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();


  
  // Obtener datos del estado de navegación
  const rideData = location.state as RideTrackingState;
  
  // Estados locales
  const [rideStatus, setRideStatus] = useState('waiting'); // waiting, confirmed, en_route, arrived, in_progress, completed
  const [estimatedTime, setEstimatedTime] = useState(8);
  const [progress, setProgress] = useState(0);
  const [driverLocation] = useState(rideData?.origin || null);
  const [showContactOptions, setShowContactOptions] = useState(false);

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
    trackUserLocation: true
  });

  // Estado del tracking en tiempo real (simulado)

  // Inicializar mapa y ruta
  useEffect(() => {
    if (rideData && rideData.origin && rideData.destination) {
      // Limpiar marcadores existentes
      clearMarkers();
      
      // Agregar marcadores de origen y destino
      addMarker({
        id: 'origin',
        location: rideData.origin,
        type: 'origin',
        label: `Origen: ${rideData.origin.name}`
      });
      
      addMarker({
        id: 'destination',
        location: rideData.destination,
        type: 'destination',
        label: `Destino: ${rideData.destination.name}`
      });
      
      // Agregar marcador del conductor
      if (rideData.driver && driverLocation) {
        addMarker({
          id: 'driver',
          location: driverLocation,
          type: 'driver',
          label: `${rideData.driver.name} - ${rideData.driver.vehicleModel}`
        });
      }
    }
  }, [rideData]);

  // Simulación del progreso del viaje
  useEffect(() => {
    const statusSequence = [
      { status: 'waiting', duration: 3000, progress: 0, message: 'Buscando conductor...' },
      { status: 'confirmed', duration: 5000, progress: 10, message: 'Conductor confirmado' },
      { status: 'en_route', duration: 8000, progress: 30, message: 'Conductor en camino' },
      { status: 'arrived', duration: 3000, progress: 50, message: 'Conductor ha llegado' },
      { status: 'in_progress', duration: 12000, progress: 80, message: 'Viaje en progreso' },
      { status: 'completed', duration: 1000, progress: 100, message: 'Viaje completado' }
    ];

    let currentStep = 0;

    const progressInterval = setInterval(() => {
      if (currentStep < statusSequence.length) {
        const currentStage = statusSequence[currentStep];
        setRideStatus(currentStage.status);
        setProgress(currentStage.progress);
        
        // Actualizar tiempo estimado
        if (currentStage.status === 'en_route') {
          setEstimatedTime(estimatedTime => Math.max(1, estimatedTime - 1));
        }
        
        // Simular movimiento del conductor (animación visual)
        
        currentStep++;
      } else {
        clearInterval(progressInterval);
      }
    }, 4000);

    return () => clearInterval(progressInterval);
  }, []);

  const handleCancelRide = () => {
    navigate(ROUTES.PASSENGER.HOME);
  };

  const handleCompleteRide = () => {
    navigate(ROUTES.PASSENGER.HOME, {
      state: { showRatingModal: true, rideData }
    });
  };

  const handleContactDriver = () => {
    setShowContactOptions(!showContactOptions);
  };

  const getStatusInfo = () => {
    switch (rideStatus) {
      case 'waiting':
        return {
          icon: '🔍',
          title: 'Buscando conductor',
          description: 'Estamos encontrando el mejor conductor para ti',
          color: 'text-yellow-600'
        };
      case 'confirmed':
        return {
          icon: '✅',
          title: 'Conductor confirmado',
          description: `${rideData?.driver?.name} aceptó tu viaje`,
          color: 'text-green-600'
        };
      case 'en_route':
        return {
          icon: '🚗',
          title: 'Conductor en camino',
          description: `Llegará en ${estimatedTime} minutos`,
          color: 'text-blue-600'
        };
      case 'arrived':
        return {
          icon: '📍',
          title: 'Conductor ha llegado',
          description: 'Tu conductor está esperándote',
          color: 'text-purple-600'
        };
      case 'in_progress':
        return {
          icon: '🎯',
          title: 'En viaje',
          description: 'Dirígete a tu destino',
          color: 'text-indigo-600'
        };
      case 'completed':
        return {
          icon: '🎉',
          title: 'Viaje completado',
          description: 'Has llegado a tu destino',
          color: 'text-green-600'
        };
      default:
        return {
          icon: '📱',
          title: 'ShareRide',
          description: 'Preparando tu viaje',
          color: 'text-gray-600'
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (!rideData) {
    return (
      <div className="ride-tracking-container">
        <div className="tracking-error">
          <h2>Error: No se encontraron datos del viaje</h2>
          <Button onClick={() => navigate(ROUTES.PASSENGER.HOME)}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-tracking-container">
      {/* Header con estado del viaje */}
      <header className="tracking-header">
        <div className="header-content">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.PASSENGER.HOME)}
            className="back-button"
          >
            ← Atrás
          </Button>
          <div className="trip-id">
            <span>Viaje #{rideData.rideId.slice(-6)}</span>
          </div>
          <div className="trip-status">
            <Badge variant={rideStatus === 'completed' ? 'default' : 'secondary'}>
              {rideStatus === 'completed' ? 'Completado' : 'En curso'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Mapa con tracking en tiempo real */}
      <div className="map-tracking-section">
        <MapComponent
          center={center}
          zoom={zoom}
          markers={markers}
          isLoading={mapLoading}
          error={mapError}
          className="tracking-map"
        />
        
        {/* Componente de tracking en tiempo real */}
        <div className="real-time-overlay">
          <RealTimeTracker />
        </div>
      </div>

      {/* Panel de información del viaje */}
      <div className="trip-info-panel">
        {/* Estado actual */}
        <Card className="status-card">
          <CardContent className="status-content">
            <div className="status-indicator">
              <span className="status-icon">{statusInfo.icon}</span>
              <div className="status-text">
                <h3 className={statusInfo.color}>{statusInfo.title}</h3>
                <p>{statusInfo.description}</p>
              </div>
            </div>
            <Progress value={progress} className="progress-bar" />
          </CardContent>
        </Card>

        {/* Información del conductor */}
        {rideData.driver && rideStatus !== 'waiting' && (
          <Card className="driver-info-card">
            <CardHeader>
              <CardTitle>Tu conductor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="driver-details">
                <div className="driver-avatar">
                  {rideData.driver.name.charAt(0)}
                </div>
                <div className="driver-info">
                  <h4>{rideData.driver.name}</h4>
                  <p>{rideData.driver.vehicleModel}</p>
                  <p>⭐ {rideData.driver.rating} • {rideData.driver.trips} viajes</p>
                  <p className="license-plate">{rideData.driver.licensePlate}</p>
                </div>
                <div className="contact-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleContactDriver}
                  >
                    Contactar
                  </Button>
                </div>
              </div>
              
              {showContactOptions && (
                <div className="contact-options">
                  <Button variant="outline" size="sm">📞 Llamar</Button>
                  <Button variant="outline" size="sm">💬 Mensaje</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detalles del viaje */}
        <Card className="trip-details-card">
          <CardHeader>
            <CardTitle>Detalles del viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="trip-route">
              <div className="route-point">
                <div className="route-dot origin"></div>
                <div className="route-info">
                  <h5>Origen</h5>
                  <p>{rideData.origin.name}</p>
                </div>
              </div>
              
              <div className="route-line"></div>
              
              <div className="route-point">
                <div className="route-dot destination"></div>
                <div className="route-info">
                  <h5>Destino</h5>
                  <p>{rideData.destination.name}</p>
                </div>
              </div>
            </div>
            
            <div className="trip-summary">
              <div className="summary-item">
                <span className="label">Vehículo:</span>
                <span className="value">{rideData.vehicleType}</span>
              </div>
              <div className="summary-item">
                <span className="label">Precio:</span>
                <span className="value">${rideData.price}</span>
              </div>
              <div className="summary-item">
                <span className="label">Distancia:</span>
                <span className="value">5.2 km</span>
              </div>
              <div className="summary-item">
                <span className="label">Tiempo estimado:</span>
                <span className="value">12 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones según el estado */}
        <div className="action-buttons">
          {rideStatus === 'waiting' && (
            <Button
              variant="destructive"
              onClick={handleCancelRide}
              className="action-button"
            >
              Cancelar viaje
            </Button>
          )}
          
          {rideStatus === 'completed' && (
            <div className="completion-actions">
              <Button
                onClick={handleCompleteRide}
                className="action-button primary"
              >
                Calificar viaje
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.PASSENGER.HOME)}
                className="action-button"
              >
                Finalizar
              </Button>
            </div>
          )}
          
          {(rideStatus === 'confirmed' || rideStatus === 'en_route') && (
            <Button
              variant="outline"
              onClick={handleContactDriver}
              className="action-button"
            >
              Contactar conductor
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideTrackingPage;
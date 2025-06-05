import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES, VEHICLE_TYPES } from '../../constants';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import MapComponent from '../../components/maps/MapComponent';
import useGoogleMaps, { MapMarker } from '../../hooks/useGoogleMaps';
import RealTimeTracker from '../../components/maps/RealTimeTracker';
import { useRides } from '../../hooks/useRides';
import { Location } from '../../types';
import { saltaLocations, mockDrivers, calculateRidePrice } from '../../data/mockData';
import '../../styles/passenger/RideRequestPage.css';

const RideRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { requestNewRide } = useRides();
  
  // Estados para la solicitud de viaje
  const [selectedVehicleType, setSelectedVehicleType] = useState(VEHICLE_TYPES[0].id);
  const [isRequestingRide, setIsRequestingRide] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [searchStage, setSearchStage] = useState<'selection' | 'searching' | 'found'>('selection');
  
  // Ubicaciones de origen y destino (usando datos reales de Salta)
  const [origin] = useState<Location>(saltaLocations.plazaJulio); // Plaza 9 de Julio
  const [destination] = useState<Location>(saltaLocations.shoppingAltaNoa); // Shopping Alto NOA
  
  // Hook de Google Maps con funcionalidades avanzadas
  const {
    center,
    zoom,
    markers,
    currentRoute,
    isLoading: mapLoading,
    error: mapError,
    clearMarkers,
    calculateRoute,
    addNearbyDrivers,
    getNearestDriver,
    initializeUserLocation
  } = useGoogleMaps({
    enableGeolocation: true,
    trackUserLocation: false,
    autoCenter: true,
    enableRouting: true
  });

  // Calcular precio estimado basado en tipo de vehículo
  const estimatedPrice = React.useMemo(() => {
    const vehicleType = VEHICLE_TYPES.find(vt => vt.id === selectedVehicleType);
    // Calcular distancia entre origen y destino
    const distance = Math.sqrt(
      Math.pow(destination.latitude - origin.latitude, 2) + 
      Math.pow(destination.longitude - origin.longitude, 2)
    ) * 111; // Aproximar a km usando factor de conversión
    
    const basePrice = calculateRidePrice(
      distance,
      (vehicleType?.id as 'economy' | 'comfort' | 'premium') || 'economy'
    );
    return Math.round(basePrice);
  }, [selectedVehicleType, origin, destination]);

  // Tiempo estimado basado en la ruta
  const estimatedTime = React.useMemo(() => {
    if (currentRoute) {
      return Math.round(currentRoute.duration);
    }
    // Fallback: calcular basado en distancia
    const distance = Math.sqrt(
      Math.pow(destination.latitude - origin.latitude, 2) + 
      Math.pow(destination.longitude - origin.longitude, 2)
    ) * 111; // Aproximar a km
    return Math.round(distance * 2.5); // 2.5 min/km estimado
  }, [currentRoute, origin, destination]);

  // Inicializar mapa y ruta al cargar
  useEffect(() => {
    const initializeMap = async () => {
      // Inicializar ubicación del usuario
      await initializeUserLocation();
      
      // Calcular ruta entre origen y destino
      await calculateRoute(origin, destination);
      
      // Agregar conductores cercanos
      addNearbyDrivers(origin, 5);
    };

    initializeMap();
  }, []);

  // Función para cambiar el tipo de vehículo
  const handleVehicleTypeChange = (vehicleTypeId: string) => {
    setSelectedVehicleType(vehicleTypeId);
    
    // Limpiar y volver a agregar conductores para el nuevo tipo de vehículo
    clearMarkers('driver');
    addNearbyDrivers(origin, 5);
  };

  // Función para seleccionar conductor desde el mapa
  const handleMarkerClick = (marker: MapMarker) => {
    if (marker.type === 'driver') {
      setSelectedDriver(marker.id);
      console.log('Conductor seleccionado:', marker);
    }
  };

  // Función para solicitar un viaje
  const handleRequestRide = async () => {
    setIsRequestingRide(true);
    setSearchStage('searching');
    
    try {
      // Simular búsqueda de conductor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Obtener conductor más cercano si no hay uno seleccionado
      let driverId = selectedDriver;
      if (!driverId) {
        const nearest = getNearestDriver(origin);
        driverId = nearest?.driver.id || null;
      }
      
      if (!driverId) {
        throw new Error('No hay conductores disponibles en este momento');
      }

      // Buscar datos del conductor
      const driver = mockDrivers.find((d: any) => d.id === driverId);
      if (!driver) {
        throw new Error('Conductor no encontrado');
      }

      setSearchStage('found');
      
      // Crear solicitud de viaje
      const rideRequest = {
        passengerId: 'current_user', // En una app real vendría del estado de auth
        origin: {
          address: 'Plaza 9 de Julio, Centro de Salta',
          location: origin
        },
        destination: {
          address: 'Alto NOA Shopping, Av. Bicentenario 702',
          location: destination
        },
        vehicleType: selectedVehicleType as 'economy' | 'comfort' | 'premium'
      };

      // Enviar solicitud usando el hook de rides
      await requestNewRide(rideRequest);
      
      // Simular aceptación del conductor después de 3 segundos
      setTimeout(() => {
        navigate(ROUTES.PASSENGER.RIDE_TRACKING, {
          state: {
            rideData: {
              ...rideRequest,
              driver: driver,
              status: 'accepted'
            }
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error al solicitar viaje:', error);
      setIsRequestingRide(false);
      setSearchStage('selection');
      // En una app real, mostrarían un mensaje de error al usuario
    }
  };

  // Función para cancelar solicitud
  const handleCancelRequest = () => {
    setIsRequestingRide(false);
    setSearchStage('selection');
    setSelectedDriver(null);
  };

  // Función para volver a la página anterior
  const handleBack = () => {
    navigate(ROUTES.PASSENGER.SEARCH_DESTINATION);
  };
  
  // Renderizar mensaje de estado basado en la etapa de búsqueda
  const renderSearchMessage = () => {
    switch (searchStage) {
      case 'searching':
        return (
          <div className="search-status searching">
            <div className="search-spinner"></div>
            <span>Buscando conductor...</span>
          </div>
        );
      case 'found':
        return (
          <div className="search-status found">
            <span>🎉 Conductor encontrado!</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ride-request-container">
      <header className="request-header">
        <Button 
          variant="ghost" 
          className="back-button" 
          onClick={handleBack}
          disabled={isRequestingRide}
        >
          ←
        </Button>
        <h1 className="header-title">Solicitar viaje</h1>
        {renderSearchMessage()}
      </header>
      
      <main className="request-main">
        <div className="map-section">
          <MapComponent
            center={center}
            zoom={zoom}
            markers={markers}
            showRoute={true}
            origin={origin}
            destination={destination}
            isLoading={mapLoading}
            error={mapError}
            onMarkerClick={handleMarkerClick}
            className="ride-request-map"
          />
          
          {/* Overlay de información de ruta */}
          {currentRoute && (
            <div className="route-overlay">
              <div className="route-info-compact">
                <span className="route-distance">
                  📍 {currentRoute.distance.toFixed(1)} km
                </span>
                <span className="route-duration">
                  🕒 {estimatedTime} min
                </span>
              </div>
            </div>
          )}
          
          {/* Contador de conductores cercanos */}
          <div className="drivers-counter">
            <Badge variant="secondary">
              🚗 {markers.filter(m => m.type === 'driver').length} conductores cercanos
            </Badge>
          </div>
        </div>
        
        <div className="ride-options-panel">
          <Card>
            <CardHeader>
              <CardTitle>
                {searchStage === 'selection' ? 'Elige tu vehículo' : 'Detalles del viaje'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchStage === 'selection' && (
                <div className="vehicle-options">
                  {VEHICLE_TYPES.map((vehicleType) => (
                    <div 
                      key={vehicleType.id}
                      className={`vehicle-option ${selectedVehicleType === vehicleType.id ? 'selected' : ''}`}
                      onClick={() => handleVehicleTypeChange(vehicleType.id)}
                    >
                      <div className="vehicle-icon">{vehicleType.icon}</div>
                      <div className="vehicle-details">
                        <div className="vehicle-name">{vehicleType.name}</div>
                        <div className="vehicle-description">{vehicleType.description}</div>
                      </div>
                      <div className="vehicle-price">
                        ${estimatedPrice} ARS
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="trip-summary">
                <div className="summary-row">
                  <span className="summary-label">📍 Origen:</span>
                  <span className="summary-value">Plaza 9 de Julio</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">🎯 Destino:</span>
                  <span className="summary-value">Shopping Alto NOA</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">⏱️ Tiempo estimado:</span>
                  <span className="summary-value">{estimatedTime} min</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">💰 Precio estimado:</span>
                  <span className="summary-value">${estimatedPrice} ARS</span>
                </div>
                {selectedDriver && (
                  <div className="summary-row">
                    <span className="summary-label">🚗 Conductor:</span>
                    <span className="summary-value">Seleccionado</span>
                  </div>
                )}
              </div>
              
              {searchStage === 'selection' && (
                <div className="payment-method">
                  <div className="payment-icon">💳</div>
                  <div className="payment-details">
                    <div className="payment-title">Método de pago</div>
                    <div className="payment-value">Tarjeta terminación 4242</div>
                  </div>
                  <Button variant="ghost" className="change-button">
                    Cambiar
                  </Button>
                </div>
              )}
              
              <div className="action-buttons">
                {searchStage === 'selection' && (
                  <Button 
                    className="request-button" 
                    onClick={handleRequestRide}
                    disabled={isRequestingRide}
                    size="lg"
                  >
                    Solicitar ahora
                  </Button>
                )}
                
                {isRequestingRide && (
                  <Button 
                    variant="outline" 
                    onClick={handleCancelRequest}
                    className="cancel-button"
                    size="lg"
                  >
                    Cancelar solicitud
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Componente de tracking en tiempo real */}
      {selectedDriver && (
        <RealTimeTracker
          driverId={selectedDriver}
          isActive={isRequestingRide}
          onLocationUpdate={(location, progress) => {
            console.log('Actualización de ubicación del conductor:', location, progress);
          }}
        />
      )}
    </div>
  );
};

export default RideRequestPage;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import { Location } from '../../types';
import { MAP_CONFIG } from '../../constants';
import { DynamicMarker, RouteLine, RadiusCircle } from './MapMarkers';
import { MapMarker } from '../../hooks/useGoogleMaps';
import '../../styles/maps/MapComponent.css';

export interface MapComponentProps {
  center?: Location;
  zoom?: number;
  markers?: MapMarker[];
  showRoute?: boolean;
  origin?: Location;
  destination?: Location;
  showUserLocation?: boolean;
  showNearbyDrivers?: boolean;
  isLoading?: boolean;
  error?: string | null;
  onMapReady?: (map: any, maps: any) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (location: Location) => void;
  style?: React.CSSProperties;
  className?: string;
}

// Opciones por defecto para Google Maps
const DEFAULT_MAP_OPTIONS = {
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: true,
  fullscreenControl: true,
  disableDefaultUI: false,
  clickableIcons: false,
  styles: [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    }
  ]
};

// Nota: LegacyMarker removido para limpiar código no utilizado

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom = MAP_CONFIG.defaultZoom,
  markers = [],
  showRoute = false,
  origin,
  destination,
  isLoading = false,
  error = null,
  onMapReady,
  onMarkerClick,
  onMapClick,
  style,
  className
}) => {
  // Referencias del mapa
  const mapRef = useRef<any>(null);
  const mapsRef = useRef<any>(null);
  
  // Estado local del mapa
  const [mapCenter, setMapCenter] = useState<Location>(
    center || {
      latitude: MAP_CONFIG.initialRegion.latitude,
      longitude: MAP_CONFIG.initialRegion.longitude
    }
  );
  
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // Actualizar el centro del mapa cuando cambia la prop center
  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  // Actualizar zoom cuando cambia la prop
  useEffect(() => {
    setCurrentZoom(zoom);
  }, [zoom]);

  // Convertir Location a formato de Google Maps
  const getGoogleMapsCoords = useCallback((location: Location) => {
    return {
      lat: location.latitude,
      lng: location.longitude
    };
  }, []);

  // Manejar cuando el mapa está listo
  const handleMapReady = useCallback((map: any, maps: any) => {
    mapRef.current = map;
    mapsRef.current = maps;
    
    // Configurar eventos del mapa
    map.addListener('click', (event: any) => {
      if (onMapClick) {
        const location: Location = {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng()
        };
        onMapClick(location);
      }
    });

    // Callback personalizado
    if (onMapReady) {
      onMapReady(map, maps);
    }
  }, [onMapReady, onMapClick]);

  // Manejar click en marcador
  const handleMarkerClick = useCallback((marker: MapMarker) => {
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  }, [onMarkerClick]);

  // Renderizar controles del mapa
  const renderMapControls = () => (
    <div className="map-controls">
      <button 
        className="map-control-button"
        onClick={() => {
          if (mapRef.current) {
            mapRef.current.setZoom(currentZoom + 1);
          }
        }}
        title="Acercar"
      >
        +
      </button>
      <button 
        className="map-control-button"
        onClick={() => {
          if (mapRef.current) {
            mapRef.current.setZoom(currentZoom - 1);
          }
        }}
        title="Alejar"
      >
        -
      </button>
      <button 
        className="map-control-button"
        onClick={() => {
          if (mapRef.current) {
            mapRef.current.setCenter(getGoogleMapsCoords(mapCenter));
            mapRef.current.setZoom(MAP_CONFIG.defaultZoom);
          }
        }}
        title="Centrar"
      >
        🎯
      </button>
    </div>
  );

  // Renderizar información de ruta
  const renderRouteInfo = () => {
    if (!showRoute || !origin || !destination) return null;

    const distance = calculateDistance(origin, destination);
    const duration = Math.round(distance * 2.5); // Estimación: 2.5 min/km

    return (
      <div className="route-info">
        <div className="route-info-header">
          🗺️ Información de Ruta
        </div>
        <div className="route-info-details">
          <div className="route-info-item">
            <span>Distancia:</span>
            <span className="route-info-value">{distance.toFixed(1)} km</span>
          </div>
          <div className="route-info-item">
            <span>Tiempo estimado:</span>
            <span className="route-info-value">{duration} min</span>
          </div>
        </div>
      </div>
    );
  };

  // Calcular distancia entre dos puntos (Haversine)
  const calculateDistance = (point1: Location, point2: Location): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRadians(point2.latitude - point1.latitude);
    const dLng = toRadians(point2.longitude - point1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(point1.latitude)) * 
              Math.cos(toRadians(point2.latitude)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  // Renderizar estado de carga
  const renderLoading = () => {
    if (!isLoading) return null;
    
    return (
      <div className="map-loading">
        <div className="map-loading-spinner"></div>
        <span>Cargando mapa...</span>
      </div>
    );
  };

  // Renderizar error
  const renderError = () => {
    if (!error) return null;
    
    // Asegurarse de que el mensaje de error sea user-friendly
    const displayError = typeof error === 'string' && error.toLowerCase().includes('api')
      ? `Error al cargar el mapa: ${error}`
      : `Ocurrió un problema con el mapa: ${error}`;

    return (
      <div className="map-error">
        <strong>Error:</strong> {displayError}
      </div>
    );
  };

  return (
    <div 
      className={`map-container ${className || ''}`}
      style={style}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ 
          key: MAP_CONFIG.googleMapsApiKey,
          libraries: ['places', 'geometry']
        }}
        defaultCenter={getGoogleMapsCoords(mapCenter)}
        defaultZoom={currentZoom}
        center={getGoogleMapsCoords(mapCenter)}
        zoom={currentZoom}
        options={DEFAULT_MAP_OPTIONS}
        onGoogleApiLoaded={({ map, maps }) => handleMapReady(map, maps)}
        yesIWantToUseGoogleMapApiInternals={true}
      >
        {/* Renderizar marcadores avanzados */}
        {markers.map((marker) => (
          <DynamicMarker
            key={marker.id}
            lat={marker.location.latitude}
            lng={marker.location.longitude}
            marker={marker}
            onClick={handleMarkerClick}
          />
        ))}
        
        {/* Marcadores de ruta (origen y destino) */}
        {showRoute && origin && (
          <DynamicMarker
            lat={origin.latitude}
            lng={origin.longitude}
            marker={{
              id: 'route-origin',
              location: origin,
              type: 'origin',
              label: 'Origen'
            }}
            onClick={handleMarkerClick}
          />
        )}
        
        {showRoute && destination && (
          <DynamicMarker
            lat={destination.latitude}
            lng={destination.longitude}
            marker={{
              id: 'route-destination',
              location: destination,
              type: 'destination',
              label: 'Destino'
            }}
            onClick={handleMarkerClick}
          />
        )}

        {/* Componentes de ruta */}
        {showRoute && origin && destination && mapRef.current && mapsRef.current && (
          <>
            <RouteLine
              map={mapRef.current}
              maps={mapsRef.current}
              origin={getGoogleMapsCoords(origin)}
              destination={getGoogleMapsCoords(destination)}
            />
            <RadiusCircle
              map={mapRef.current}
              maps={mapsRef.current}
              center={getGoogleMapsCoords(origin)}
              radius={500} // 500 metros de radio
              fillColor="#3b82f6"
              strokeColor="#1d4ed8"
            />
          </>
        )}
      </GoogleMapReact>
      
      {/* Componentes de UI superpuestos */}
      {renderLoading()}
      {renderError()}
      {renderMapControls()}
      {renderRouteInfo()}
    </div>
  );
};

export default MapComponent;

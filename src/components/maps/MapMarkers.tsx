// Componentes de marcadores avanzados para Google Maps
import React from 'react';
import { MapMarker } from '../../hooks/useGoogleMaps';

interface MarkerComponentProps {
  lat: number;
  lng: number;
  marker: MapMarker;
  onClick?: (marker: MapMarker) => void;
}

// Marcador de usuario con pulso
export const UserMarker: React.FC<MarkerComponentProps> = ({ marker, onClick }) => {
  return (
    <div 
      className="user-marker-container"
      onClick={() => onClick?.(marker)}
    >
      <div className="user-marker">
        <div className="user-marker-pulse"></div>
        <div className="user-marker-dot">
          <span>📍</span>
        </div>
      </div>
      {marker.label && (
        <div className="marker-tooltip user-tooltip">
          {marker.label}
        </div>
      )}
    </div>
  );
};

// Marcador de conductor con información
export const DriverMarker: React.FC<MarkerComponentProps> = ({ marker, onClick }) => {
  const driverData = marker.data || {};
  
  return (
    <div 
      className="driver-marker-container"
      onClick={() => onClick?.(marker)}
    >
      <div className="driver-marker">
        <div className="driver-icon">🚗</div>
        {driverData.eta && (
          <div className="driver-eta">{driverData.eta}min</div>
        )}
      </div>
      {marker.label && (
        <div className="marker-tooltip driver-tooltip">
          <div className="tooltip-header">{marker.label}</div>
          {driverData.vehicle && (
            <div className="tooltip-vehicle">{driverData.vehicle}</div>
          )}
          {driverData.rating && (
            <div className="tooltip-rating">
              ⭐ {driverData.rating.toFixed(1)}
            </div>
          )}
          {driverData.eta && (
            <div className="tooltip-eta">Llegada: {driverData.eta} min</div>
          )}
        </div>
      )}
    </div>
  );
};

// Marcador de origen
export const OriginMarker: React.FC<MarkerComponentProps> = ({ marker, onClick }) => {
  return (
    <div 
      className="origin-marker-container"
      onClick={() => onClick?.(marker)}
    >
      <div className="origin-marker">
        <div className="origin-circle">
          <span>A</span>
        </div>
      </div>
      {marker.label && (
        <div className="marker-tooltip origin-tooltip">
          {marker.label}
        </div>
      )}
    </div>
  );
};

// Marcador de destino
export const DestinationMarker: React.FC<MarkerComponentProps> = ({ marker, onClick }) => {
  return (
    <div 
      className="destination-marker-container"
      onClick={() => onClick?.(marker)}
    >
      <div className="destination-marker">
        <div className="destination-circle">
          <span>B</span>
        </div>
      </div>
      {marker.label && (
        <div className="marker-tooltip destination-tooltip">
          {marker.label}
        </div>
      )}
    </div>
  );
};

// Marcador de viaje compartido
export const SharedRideMarker: React.FC<MarkerComponentProps> = ({ marker, onClick }) => {
  const sharedData = marker.data || {};
  
  return (
    <div 
      className="shared-marker-container"
      onClick={() => onClick?.(marker)}
    >
      <div className="shared-marker">
        <div className="shared-icon">👥</div>
        {sharedData.availableSeats && (
          <div className="shared-seats">{sharedData.availableSeats}</div>
        )}
      </div>
      {marker.label && (
        <div className="marker-tooltip shared-tooltip">
          <div className="tooltip-header">{marker.label}</div>
          {sharedData.destination && (
            <div className="tooltip-destination">→ {sharedData.destination}</div>
          )}
          {sharedData.availableSeats && (
            <div className="tooltip-seats">
              Asientos: {sharedData.availableSeats}
            </div>
          )}
          {sharedData.price && (
            <div className="tooltip-price">
              ${sharedData.price} ARS
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente principal que renderiza el marcador apropiado
export const DynamicMarker: React.FC<MarkerComponentProps> = ({ lat, lng, marker, onClick }) => {
  const commonProps = { lat, lng, marker, onClick };
  
  switch (marker.type) {
    case 'user':
      return <UserMarker {...commonProps} />;
    case 'driver':
      return <DriverMarker {...commonProps} />;
    case 'origin':
      return <OriginMarker {...commonProps} />;
    case 'destination':
      return <DestinationMarker {...commonProps} />;
    case 'shared':
      return <SharedRideMarker {...commonProps} />;
    default:
      return <UserMarker {...commonProps} />;
  }
};

// Componente de ruta (línea entre puntos)
interface RouteLineProps {
  map?: any;
  maps?: any;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  color?: string;
  strokeWeight?: number;
}

export const RouteLine: React.FC<RouteLineProps> = ({ 
  map, 
  maps, 
  origin, 
  destination, 
  color = '#4285F4',
  strokeWeight = 4 
}) => {
  React.useEffect(() => {
    if (!map || !maps) return;

    const routePath = new maps.Polyline({
      path: [origin, destination],
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: strokeWeight
    });

    routePath.setMap(map);

    return () => {
      routePath.setMap(null);
    };
  }, [map, maps, origin, destination, color, strokeWeight]);

  return null; // Este componente no renderiza nada directamente
};

// Componente de círculo de radio (para mostrar área de cobertura)
interface RadiusCircleProps {
  map?: any;
  maps?: any;
  center: { lat: number; lng: number };
  radius: number; // en metros
  fillColor?: string;
  strokeColor?: string;
}

export const RadiusCircle: React.FC<RadiusCircleProps> = ({ 
  map, 
  maps, 
  center, 
  radius,
  fillColor = '#4285F4',
  strokeColor = '#4285F4'
}) => {
  React.useEffect(() => {
    if (!map || !maps) return;

    const circle = new maps.Circle({
      strokeColor: strokeColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: fillColor,
      fillOpacity: 0.15,
      map: map,
      center: center,
      radius: radius,
    });

    return () => {
      circle.setMap(null);
    };
  }, [map, maps, center, radius, fillColor, strokeColor]);

  return null;
};

// Hook para animaciones de marcadores
export const useMarkerAnimation = (marker: MapMarker) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  
  React.useEffect(() => {
    if (marker.animated) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [marker.animated, marker.location]);
  
  return isAnimating;
};

export default DynamicMarker;

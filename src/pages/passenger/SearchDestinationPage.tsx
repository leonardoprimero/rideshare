import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES, POPULAR_LOCATIONS_SALTA } from '../../constants';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import MapComponent from '../../components/maps/MapComponent';
import '../../styles/passenger/SearchDestinationPage.css';

// Usar las ubicaciones populares de Salta desde las constantes
const mockPlaces = POPULAR_LOCATIONS_SALTA.map(location => ({
  id: location.id,
  name: location.name,
  address: location.address,
  lat: location.latitude,
  lng: location.longitude
}));

const SearchDestinationPage: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const mapRef = useRef<HTMLDivElement>(null);
  // const googleMapRef = useRef<google.maps.Map | null>(null);
  // const originMarkerRef = useRef<google.maps.Marker | null>(null);
  // const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  // const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  // const { user } = useSelector((state: RootState) => state.auth);
  
  // Estados para la búsqueda y selección de destino
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockPlaces>([]);
  const [selectedDestination, setSelectedDestination] = useState<(typeof mockPlaces)[0] | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isRouteShown, setIsRouteShown] = useState(false);
  const [isRequestingRide, setIsRequestingRide] = useState(false);
  const [requestStatusMessage, setRequestStatusMessage] = useState('');
  
  // Obtener la ubicación del usuario al cargar la página
  useEffect(() => {
    setRequestStatusMessage("Obteniendo tu ubicación...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setRequestStatusMessage(""); // Clear message on success
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          setUserLocation({ lat: -24.7859, lng: -65.4117 }); // Centro de Salta
          setRequestStatusMessage("No se pudo obtener tu ubicación. Usando ubicación predeterminada.");
        }
      );
    } else {
      setUserLocation({ lat: -24.7859, lng: -65.4117 }); // Centro de Salta
      setRequestStatusMessage("Geolocalización no soportada. Usando ubicación predeterminada.");
    }
  }, []);

  // Inicializar Google Maps cuando se carga la ubicación del usuario
  useEffect(() => {
    if (userLocation && mapRef.current && !isMapLoaded) {
      // Inicializar el mapa con la ubicación actual
      initializeMap();
    }
  }, [userLocation]);

  // Función para inicializar el mapa (implementación real)
  const initializeMap = () => {
    console.log('Mapa inicializado en:', userLocation);
    setIsMapLoaded(true);
    
    // En esta versión mejorada, usamos el componente MapComponent
    // que ya está configurado para usar la API de Google Maps
    // El mapa se renderizará en el return del componente
  };

  // Función para buscar lugares según la consulta
  const searchPlaces = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Filtrar lugares que coincidan con la consulta
    const filteredPlaces = mockPlaces.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) || 
      place.address.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filteredPlaces);
  };

  // Efecto para actualizar resultados cuando cambia la consulta
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Función para seleccionar un destino
  const handleSelectDestination = (place: typeof mockPlaces[0]) => {
    setSelectedDestination(place);
    setSearchQuery(place.name);
    setSearchResults([]);
    
    // En una implementación real, añadiríamos el marcador de destino
    // if (googleMapRef.current) {
    //   if (destinationMarkerRef.current) {
    //     destinationMarkerRef.current.setMap(null);
    //   }
    //   
    //   destinationMarkerRef.current = new google.maps.Marker({
    //     position: { lat: place.lat, lng: place.lng },
    //     map: googleMapRef.current,
    //     title: place.name,
    //     icon: {
    //       path: google.maps.SymbolPath.CIRCLE,
    //       scale: 10,
    //       fillColor: COLORS.accent,
    //       fillOpacity: 1,
    //       strokeWeight: 2,
    //       strokeColor: COLORS.card,
    //     },
    //   });
    // }
    
    // Calcular y mostrar la ruta
    calculateRoute(place);
  };

  // Función para calcular la ruta entre origen y destino
  const calculateRoute = (destination: typeof mockPlaces[0]) => {
    if (!userLocation) return;
    
    // Para desarrollo: solo logueamos el destino
    console.log('Calculating route to:', destination.name);
    
    // En una implementación real, usaríamos el servicio de direcciones de Google
    // const directionsService = new google.maps.DirectionsService();
    // 
    // directionsService.route(
    //   {
    //     origin: userLocation,
    //     destination: { lat: destination.lat, lng: destination.lng },
    //     travelMode: google.maps.TravelMode.DRIVING,
    //   },
    //   (result, status) => {
    //     if (status === google.maps.DirectionsStatus.OK && result) {
    //       directionsRendererRef.current?.setDirections(result);
    //       setIsRouteShown(true);
    //     }
    //   }
    // );
    
    // Para la demostración, simplemente marcamos que se ha mostrado la ruta
    setIsRouteShown(true); // Ensure map displays the route
  };

  // Función para continuar al siguiente paso (solicitud de viaje)
  const handleContinue = () => {
    if (selectedDestination && !isRequestingRide) {
      setIsRequestingRide(true);
      setRequestStatusMessage("Buscando conductores cercanos...");

      setTimeout(() => {
        setRequestStatusMessage("¡Conductor encontrado! Mostrando ruta al destino.");
        // La ruta ya debería estar visible debido a calculateRoute
        // Opcionalmente, navegar después de un tiempo:
        // setTimeout(() => {
        //   navigate(ROUTES.PASSENGER.RIDE_TRACKING);
        // }, 1500);
      }, 2500); // Simular búsqueda por 2.5 segundos
    }
  };

  // Función para volver a la página anterior
  const handleBack = () => {
    navigate(ROUTES.PASSENGER.HOME);
  };

  return (
    <div className="search-destination-container">
      <header className="search-header">
        <Button 
          variant="ghost" 
          className="back-button" 
          onClick={handleBack}
        >
          ←
        </Button>
        <div className="search-input-container">
          <Input
            type="text"
            placeholder="¿A dónde vas?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </header>
      
      <main className="search-main">
        {!selectedDestination && !isRequestingRide && (
          <div className="contextual-guide passenger-guide">
            <p><strong>Guía Rápida:</strong></p>
            <ol>
              <li>Busca tu destino en la barra superior.</li>
              <li>Selecciónalo de la lista de resultados.</li>
              <li>Confirma los detalles para ver la ruta y solicitar tu viaje.</li>
            </ol>
          </div>
        )}

        {searchResults.length > 0 && !selectedDestination && (
          <div className="search-results">
            {searchResults.map((place) => (
              <div 
                key={place.id} 
                className="result-item"
                onClick={() => handleSelectDestination(place)}
              >
                <div className="result-icon">📍</div>
                <div className="result-details">
                  <div className="result-name">{place.name}</div>
                  <div className="result-address">{place.address}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="map-container"
          style={{ display: isMapLoaded ? 'block' : 'none' }}
        >
          {userLocation && (
            <MapComponent
              center={{ 
                latitude: userLocation.lat, 
                longitude: userLocation.lng 
              }}
              zoom={14}
              markers={[
                {
                  id: 'user-location',
                  location: { 
                    latitude: userLocation.lat, 
                    longitude: userLocation.lng 
                  },
                  type: 'user',
                  label: 'Tu ubicación'
                },
                ...(selectedDestination ? [{
                  id: 'destination',
                  location: { 
                    latitude: selectedDestination.lat, 
                    longitude: selectedDestination.lng 
                  },
                  type: 'destination' as const,
                  label: selectedDestination.name
                }] : [])
              ]}
              showRoute={isRouteShown && !!selectedDestination}
              origin={userLocation ? { 
                latitude: userLocation.lat, 
                longitude: userLocation.lng 
              } : undefined}
              destination={selectedDestination ? { 
                latitude: selectedDestination.lat, 
                longitude: selectedDestination.lng 
              } : undefined}
            />
          )}
        </div>
        
        {!isMapLoaded && userLocation && ( // Show loading only if location is determined
          <div className="loading-map">
            <p>Cargando mapa...</p>
          </div>
        )}

        {/* Mensaje de estado de obtención de ubicación o solicitud de viaje */}
        {requestStatusMessage && (
          <div className="status-message-panel">
            <p>{requestStatusMessage}</p>
          </div>
        )}
        
        {selectedDestination && !isRequestingRide && ( // Hide panel if requesting ride
          <div className="destination-panel">
            <Card>
              <div className="destination-details">
                <h3>Destino seleccionado</h3>
                <p>{selectedDestination.name}</p>
                <p className="destination-address">{selectedDestination.address}</p>
                
                <div className="trip-info">
                  <div className="trip-distance">
                    <span className="info-label">Distancia</span>
                    <span className="info-value">5.2 km</span>
                  </div>
                  <div className="trip-time">
                    <span className="info-label">Tiempo est.</span>
                    <span className="info-value">15 min</span>
                  </div>
                  <div className="trip-price">
                    <span className="info-label">Precio est.</span>
                    <span className="info-value">$120 ARS</span>
                  </div>
                </div>
                
                <Button 
                  className="continue-button" 
                  onClick={handleContinue}
                  disabled={isRequestingRide}
                >
                  {isRequestingRide ? "Buscando..." : "Continuar"}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Display message when ride is requested and route is shown */}
        {selectedDestination && isRequestingRide && requestStatusMessage.includes("¡Conductor encontrado!") && (
           <div className="destination-panel">
           <Card>
             <div className="destination-details">
                <h3>Viaje Confirmado</h3>
                <p>Tu conductor está en camino.</p>
                <p>Destino: {selectedDestination.name}</p>
                <p className="destination-address">{selectedDestination.address}</p>
             </div>
           </Card>
         </div>
        )}
      </main>
    </div>
  );
};

export default SearchDestinationPage;

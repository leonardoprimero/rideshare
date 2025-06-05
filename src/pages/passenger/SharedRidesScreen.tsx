import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constants';

import { SharedRide } from '../../types';
import '../../styles/passenger/SharedRidesScreen.css';

// Componente para la búsqueda y unión a viajes compartidos
const SharedRidesScreen: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useSelector((state: RootState) => state.auth);
  
  // Estado para los viajes compartidos disponibles
  const [sharedRides, setSharedRides] = useState<SharedRide[]>([]);
  // Estado para mostrar detalles de un viaje
  const [selectedRide, setSelectedRide] = useState<SharedRide | null>(null);
  // Estado para indicar carga
  const [isLoading, setIsLoading] = useState(true);
  
  // Cargar viajes compartidos disponibles (simulados)
  useEffect(() => {
    // En una implementación real, esto vendría de una API
    setTimeout(() => {
      const sampleRides: SharedRide[] = [
        {
          id: 'shared-1',
          driver: {
            id: 'driver-1',
            name: 'Carlos Rodríguez',
            rating: 4.8,
          },
          origin: {
            name: 'Polanco',
            address: 'Av. Presidente Masaryk 111, Polanco, SLT',
            location: {
              latitude: -24.7859,  
              longitude: -65.41166
            },
          },
          destination: {
            name: 'Santa Fe',
            address: 'Centro Comercial Santa Fe, SLT',
            location: {
              latitude: -24.7859,  
              longitude: -65.41166
            },
          },
          departureTime: '08:30',
          departureDate: 'Lun, 2 Jun',
          availableSeats: 3,
          pricePerSeat: 60,
          passengers: 1,
          isRecurring: true,
          recurringDays: ['monday', 'wednesday', 'friday'],
        },
        {
          id: 'shared-2',
          driver: {
            id: 'driver-2',
            name: 'Laura Cornejo',
            rating: 4.9,
          },
          origin: {
            name: 'Castañares',
            address: 'Av. Tavella 466, , SLT',
            location: {
              latitude: -24.7859,  
              longitude: -65.41166
            },
          },
          destination: {
            name: 'Aeropuerto',
            address: 'Aeropuerto Internacional Martín Miguel de Güemes, SLT',
            location: {
              latitude: -24.7859,  
              longitude: -65.41166
            },
          },
          departureTime: '14:00',
          departureDate: 'Mar, 3 Jun',
          availableSeats: 2,
          pricePerSeat: 80,
          passengers: 0,
          isRecurring: false,
        },
        {
          id: 'shared-3',
          driver: {
            id: 'driver-3',
            name: 'Gustavo Saenz',
            rating: 4.7,
          },
          origin: {
            name: 'Campo Caseros',
            address: 'Plaza Alvarado, Alvarado & Ayacucho, SLT',
            location: {
              latitude: -24.7859,  
              longitude: -65.41166
            },
          },
          destination: {
            name: 'Plaza 9 de Julio',
            address: 'Zuviría & España, Centro Histórico, SLT',
            location: {
              latitude: -24.7859,  
              longitude: -65.41166
            },
          },
          departureTime: '09:15',
          departureDate: 'Mié, 4 Jun',
          availableSeats: 4,
          pricePerSeat: 50,
          passengers: 2,
          isRecurring: true,
          recurringDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        },
      ];
      
      setSharedRides(sampleRides);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  const handleJoinRide = () => {
    if (!selectedRide) return;
    
    // En una implementación real, esto enviaría la solicitud al backend
    alert(`Solicitud enviada para unirte al viaje de ${selectedRide.driver.name}`);
    setSelectedRide(null);
  };

  return (
    <div className="shared-rides-container">
      <header className="shared-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate(ROUTES.PASSENGER.HOME)}
          >
            ← Volver
          </button>
          <h1>Viajes compartidos disponibles</h1>
        </div>
      </header>
      
      <main className="shared-main">
        {!selectedRide && (
          <>
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Buscando viajes compartidos...</p>
              </div>
            ) : sharedRides.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🚗</div>
                <h2>No hay viajes compartidos disponibles</h2>
                <p>Intenta buscar más tarde o ajusta tus preferencias de búsqueda.</p>
              </div>
            ) : (
              <div className="rides-list">
                {sharedRides.map(ride => (
                  <div 
                    key={ride.id} 
                    className="ride-card"
                    onClick={() => setSelectedRide(ride)}
                  >
                    <div className="ride-header">
                      <div className="date-time">
                        <div className="ride-date">{ride.departureDate}</div>
                        <div className="ride-time">{ride.departureTime}</div>
                      </div>
                      <div className="ride-price">${ride.pricePerSeat}/persona</div>
                    </div>
                    
                    <div className="ride-route">
                      <div className="route-point">
                        <div className="point-marker origin">●</div>
                        <div className="point-address">{ride.origin.name}</div>
                      </div>
                      <div className="route-divider"></div>
                      <div className="route-point">
                        <div className="point-marker destination">●</div>
                        <div className="point-address">{ride.destination.name}</div>
                      </div>
                    </div>
                    
                    <div className="driver-info">
                      <div className="driver-avatar">
                        {ride.driver.name.charAt(0)}
                      </div>
                      <div className="driver-details">
                        <div className="driver-name">{ride.driver.name}</div>
                        <div className="driver-rating">⭐ {ride.driver.rating}</div>
                      </div>
                      <div className="seats-info">
                        {ride.availableSeats} asientos disponibles
                      </div>
                    </div>
                    
                    {ride.isRecurring && (
                      <div className="recurring-badge">Recurrente</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {selectedRide && (
          <div className="ride-details-container">
            <div className="details-header">
              <h2>Detalles del viaje compartido</h2>
              <button 
                className="close-button"
                onClick={() => setSelectedRide(null)}
              >
                ×
              </button>
            </div>
            
            <div className="details-content">
              <div className="map-placeholder">
                <div className="map-info">
                  <p>Mapa de la ruta:</p>
                  <p>Origen: {selectedRide.origin.name}</p>
                  <p>Destino: {selectedRide.destination.name}</p>
                </div>
                <div className="map-markers">
                  <div className="origin-marker" style={{ top: '30%', left: '30%' }}>
                    🟢
                  </div>
                  <div className="destination-marker" style={{ top: '70%', left: '70%' }}>
                    🔴
                  </div>
                  <div className="route-line"></div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Conductor</h3>
                <div className="driver-profile">
                  <div className="driver-avatar-large">
                    {selectedRide.driver.name.charAt(0)}
                  </div>
                  <div className="driver-details-large">
                    <div className="driver-name-large">{selectedRide.driver.name}</div>
                    <div className="driver-rating-large">⭐ {selectedRide.driver.rating}</div>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Ruta</h3>
                <div className="ride-route">
                  <div className="route-point">
                    <div className="point-marker origin">●</div>
                    <div className="point-address">{selectedRide.origin.address}</div>
                  </div>
                  <div className="route-divider"></div>
                  <div className="route-point">
                    <div className="point-marker destination">●</div>
                    <div className="point-address">{selectedRide.destination.address}</div>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Horario</h3>
                <div className="detail-item">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value">{selectedRide.departureDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hora de salida:</span>
                  <span className="detail-value">{selectedRide.departureTime}</span>
                </div>
                
                {selectedRide.isRecurring && selectedRide.recurringDays && (
                  <div className="recurring-info">
                    <div className="detail-item">
                      <span className="detail-label">Viaje recurrente:</span>
                      <span className="detail-value">
                        {selectedRide.recurringDays.map(day => {
                          switch(day) {
                            case 'monday': return 'Lunes';
                            case 'tuesday': return 'Martes';
                            case 'wednesday': return 'Miércoles';
                            case 'thursday': return 'Jueves';
                            case 'friday': return 'Viernes';
                            case 'saturday': return 'Sábado';
                            case 'sunday': return 'Domingo';
                            default: return '';
                          }
                        }).join(', ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="details-section">
                <h3>Detalles</h3>
                <div className="detail-item">
                  <span className="detail-label">Asientos disponibles:</span>
                  <span className="detail-value">
                    {selectedRide.availableSeats} de {selectedRide.availableSeats + selectedRide.passengers}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Precio por asiento:</span>
                  <span className="detail-value">${selectedRide.pricePerSeat}</span>
                </div>
              </div>
              
              <button
                className="join-button"
                onClick={handleJoinRide}
              >
                Solicitar unirme al viaje
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SharedRidesScreen;

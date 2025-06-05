import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES, WEEK_DAYS } from '../../constants';

import { RecurringRide } from '../../types';
import '../../styles/driver/DriverRecurringRidesScreen.css';

// Componente para la gestión de viajes recurrentes del conductor
const DriverRecurringRidesScreen: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useSelector((state: RootState) => state.auth);
  
  // Estado para los viajes recurrentes
  const [recurringRides, setRecurringRides] = useState<RecurringRide[]>([]);
  // Estado para mostrar el formulario de nuevo viaje
  const [isAddingNew, setIsAddingNew] = useState(false);
  // Estado para mostrar detalles de un viaje
  const [selectedRide, setSelectedRide] = useState<RecurringRide | null>(null);
  
  // Datos para el formulario de nuevo viaje recurrente
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState('08:00');
  const [availableSeats, setAvailableSeats] = useState('3');
  const [pricePerSeat, setPricePerSeat] = useState('50');
  
  // Cargar viajes recurrentes existentes (simulados)
  useEffect(() => {
    // En una implementación real, esto vendría de una API
    const sampleRides: RecurringRide[] = [
      {
        id: 'recurring-1',
        driverId: 'driver-1',
        origin: {
          name: 'Mi Casa',
          address: 'Calle Batalla de Salta 123, Barrio Ciudad del Milagro, SLT',
          location: {
            latitude: 19.4326,
            longitude: -99.1332,
          },
        },
        destination: {
          name: 'Oficina',
          address: 'Productos Sofía, Parque Industrial, SLT',
          location: {
            latitude: 19.4240,
            longitude: -99.1673,
          },
        },
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        departureTime: '08:00',
        availableSeats: 3,
        pricePerSeat: 50,
        passengers: [
          {
            id: 'passenger-1',
            name: 'Emilio Martinez',
            rating: 4.8,
          }
        ],
      },
      {
        id: 'recurring-2',
        driverId: 'driver-1',
        origin: {
          name: 'Oficina',
          address: 'Alto NOA Shoping, Av. Bicentenario de la Batalla de Salta 600, SLT',
          location: {
            latitude: 19.4240,
            longitude: -99.1673,
          },
        },
        destination: {
          name: 'Mi Casa',
          address: 'Luis Burela 1, Casona del Molino, SLT',
          location: {
            latitude: 19.4326,
            longitude: -99.1332,
          },
        },
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        departureTime: '18:30',
        availableSeats: 3,
        pricePerSeat: 50,
        passengers: [],
      },
    ];
    
    setRecurringRides(sampleRides);
  }, []);
  
  const handleDayToggle = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(id => id !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };
  
  const handleCreateRide = () => {
    // En una implementación real, esto enviaría los datos a una API
    const newRide: RecurringRide = {
      id: `recurring-${Date.now()}`,
      driverId: 'driver-1',
      origin: {
        name: origin,
        address: `${origin} (dirección completa)`,
        location: {
          latitude: 19.4326,
          longitude: -99.1332,
        },
      },
      destination: {
        name: destination,
        address: `${destination} (dirección completa)`,
        location: {
          latitude: 19.4240,
          longitude: -99.1673,
        },
      },
      days: selectedDays,
      departureTime,
      availableSeats: parseInt(availableSeats, 10),
      pricePerSeat: parseInt(pricePerSeat, 10),
      passengers: [],
    };
    
    setRecurringRides([...recurringRides, newRide]);
    resetForm();
  };
  
  const resetForm = () => {
    setIsAddingNew(false);
    setOrigin('');
    setDestination('');
    setSelectedDays([]);
    setDepartureTime('08:00');
    setAvailableSeats('3');
    setPricePerSeat('50');
  };
  
  const handleDeleteRide = (rideId: string) => {
    setRecurringRides(recurringRides.filter(ride => ride.id !== rideId));
    setSelectedRide(null);
  };

  return (
    <div className="recurring-rides-container">
      <header className="recurring-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate(ROUTES.DRIVER.HOME)}
          >
            ← Volver
          </button>
          <h1>Mis viajes recurrentes</h1>
        </div>
      </header>
      
      <main className="recurring-main">
        {!isAddingNew && !selectedRide && (
          <>
            <div className="add-button-container">
              <button 
                className="add-button"
                onClick={() => setIsAddingNew(true)}
              >
                + Nuevo viaje recurrente
              </button>
            </div>
            
            {recurringRides.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🚗</div>
                <h2>No tienes viajes recurrentes</h2>
                <p>Crea un nuevo viaje recurrente para compartir tu ruta con pasajeros.</p>
              </div>
            ) : (
              <div className="rides-list">
                {recurringRides.map(ride => {
                  // Convertir los IDs de días a nombres para mostrar
                  const dayNames = ride.days.map(dayId => {
                    const day = WEEK_DAYS.find(d => d.id === dayId);
                    return day ? day.name.substring(0, 3) : '';
                  }).join(', ');
                  
                  return (
                    <div 
                      key={ride.id} 
                      className="ride-card"
                      onClick={() => setSelectedRide(ride)}
                    >
                      <div className="ride-header">
                        <div className="ride-time">{ride.departureTime}</div>
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
                      
                      <div className="ride-details">
                        <div className="ride-days">{dayNames}</div>
                        <div className="ride-seats">
                          {ride.availableSeats - ride.passengers.length} asientos disponibles
                        </div>
                      </div>
                      
                      {ride.passengers.length > 0 && (
                        <div className="passengers-preview">
                          <div className="passengers-count">
                            {ride.passengers.length} pasajero(s) confirmado(s)
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        
        {isAddingNew && (
          <div className="form-container">
            <div className="form-header">
              <h2>Nuevo viaje recurrente</h2>
              <button 
                className="close-button"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            
            <div className="form-content">
              <div className="form-group">
                <label htmlFor="origin">Origen</label>
                <input
                  type="text"
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ej. Mi Casa"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="destination">Destino</label>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ej. Oficina"
                />
              </div>
              
              <div className="form-group">
                <label>Días de la semana</label>
                <div className="days-selector">
                  {WEEK_DAYS.map(day => (
                    <button
                      key={day.id}
                      className={`day-button ${selectedDays.includes(day.id) ? 'selected' : ''}`}
                      onClick={() => handleDayToggle(day.id)}
                    >
                      {day.name.substring(0, 1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="departureTime">Hora de salida</label>
                <input
                  type="time"
                  id="departureTime"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="availableSeats">Asientos disponibles</label>
                  <input
                    type="number"
                    id="availableSeats"
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(e.target.value)}
                    min="1"
                    max="8"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="pricePerSeat">Precio por asiento ($)</label>
                  <input
                    type="number"
                    id="pricePerSeat"
                    value={pricePerSeat}
                    onChange={(e) => setPricePerSeat(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              <button
                className="submit-button"
                onClick={handleCreateRide}
                disabled={!origin || !destination || selectedDays.length === 0}
              >
                Crear viaje recurrente
              </button>
            </div>
          </div>
        )}
        
        {selectedRide && (
          <div className="ride-details-container">
            <div className="details-header">
              <h2>Detalles del viaje recurrente</h2>
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
                  <span className="detail-label">Días:</span>
                  <span className="detail-value">
                    {selectedRide.days.map(dayId => {
                      const day = WEEK_DAYS.find(d => d.id === dayId);
                      return day ? day.name : '';
                    }).join(', ')}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hora de salida:</span>
                  <span className="detail-value">{selectedRide.departureTime}</span>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Detalles</h3>
                <div className="detail-item">
                  <span className="detail-label">Asientos disponibles:</span>
                  <span className="detail-value">
                    {selectedRide.availableSeats - selectedRide.passengers.length} de {selectedRide.availableSeats}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Precio por asiento:</span>
                  <span className="detail-value">${selectedRide.pricePerSeat}</span>
                </div>
              </div>
              
              {selectedRide.passengers.length > 0 && (
                <div className="details-section">
                  <h3>Pasajeros confirmados</h3>
                  <div className="passengers-list">
                    {selectedRide.passengers.map(passenger => (
                      <div key={passenger.id} className="passenger-item">
                        <div className="passenger-avatar">
                          {passenger.name.charAt(0)}
                        </div>
                        <div className="passenger-info">
                          <div className="passenger-name">{passenger.name}</div>
                          <div className="passenger-rating">⭐ {passenger.rating}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="details-actions">
                <button 
                  className="edit-button"
                  onClick={() => {/* Implementar edición */}}
                >
                  Editar
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteRide(selectedRide.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverRecurringRidesScreen;

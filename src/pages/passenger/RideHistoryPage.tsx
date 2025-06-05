import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../hooks/useAuth';
import { useRides } from '../../hooks/useRides';
import { ROUTES } from '../../constants';
import '../../styles/passenger/RideHistoryPage.css';

const RideHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rideHistory } = useRides();
  
  // Estados locales
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'rating'>('date');

  // Filtrar viajes
  const filteredRides = rideHistory.filter(ride => {
    if (filter === 'all') return true;
    return ride.status === filter;
  });

  // Ordenar viajes
  const sortedRides = [...filteredRides].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price':
        return b.price - a.price;
      case 'rating':
        return 0; // Placeholder for rating sort
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="status-completed">Completado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En progreso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const calculateTotalSpent = () => {
    return filteredRides
      .filter(ride => ride.status === 'completed')
      .reduce((total, ride) => total + ride.price, 0);
  };

  const handleRideDetails = (rideId: string) => {
    navigate(`/passenger/ride-details/${rideId}`);
  };

  const handleRepeatRide = (ride: any) => {
    navigate(ROUTES.PASSENGER.RIDE_REQUEST, {
      state: {
        origin: ride.origin,
        destination: ride.destination,
        vehicleType: 'economy'
      }
    });
  };

  return (
    <div className="ride-history-container">
      {/* Header */}
      <header className="history-header">
        <div className="header-content">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.PASSENGER.HOME)}
            className="back-button"
          >
            ← Atrás
          </Button>
          <h1 className="page-title">Historial de viajes</h1>
          <div className="user-greeting">
            <span>Hola, {user?.name?.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      {/* Resumen estadísticas */}
      <div className="stats-summary">
        <div className="stats-grid">
          <Card className="summary-card">
            <CardContent className="summary-content">
              <div className="stat-icon">🚗</div>
              <div className="stat-info">
                <h3>{rideHistory.length}</h3>
                <p>Viajes totales</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="summary-card">
            <CardContent className="summary-content">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>${calculateTotalSpent()}</h3>
                <p>Total gastado</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="summary-card">
            <CardContent className="summary-content">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>4.8</h3>
                <p>Rating promedio</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="filters-section">
        <div className="filter-group">
          <h4>Filtrar por:</h4>
          <div className="filter-buttons">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completados
            </Button>
            <Button
              variant={filter === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('cancelled')}
            >
              Cancelados
            </Button>
          </div>
        </div>

        <div className="sort-group">
          <h4>Ordenar por:</h4>
          <div className="sort-buttons">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
            >
              Fecha
            </Button>
            <Button
              variant={sortBy === 'price' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price')}
            >
              Precio
            </Button>
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rating')}
            >
              Rating
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de viajes */}
      <div className="rides-list-section">
        {sortedRides.length === 0 ? (
          <div className="empty-state">
            <Card>
              <CardContent className="empty-content">
                <div className="empty-icon">📭</div>
                <h3>No hay viajes que mostrar</h3>
                <p>
                  {filter !== 'all' 
                    ? `No tienes viajes ${filter === 'completed' ? 'completados' : 'cancelados'} aún`
                    : 'Aún no has realizado ningún viaje'
                  }
                </p>
                <Button onClick={() => navigate(ROUTES.PASSENGER.HOME)}>
                  Solicitar primer viaje
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="rides-list">
            {sortedRides.map((ride) => (
              <Card key={ride.id} className="ride-card">
                <CardHeader className="ride-header">
                  <div className="ride-title-section">
                    <CardTitle className="ride-title">
                      {formatDate(ride.createdAt)}
                    </CardTitle>
                    {getStatusBadge(ride.status)}
                  </div>
                  <div className="ride-price">
                    ${ride.price}
                  </div>
                </CardHeader>
                
                <CardContent className="ride-content">
                  {/* Ruta del viaje */}
                  <div className="route-section">
                    <div className="route-point">
                      <div className="route-dot origin"></div>
                      <div className="route-info">
                        <h5>Origen</h5>
                        <p>{ride.origin.address}</p>
                      </div>
                    </div>
                    
                    <div className="route-line"></div>
                    
                    <div className="route-point">
                      <div className="route-dot destination"></div>
                      <div className="route-info">
                        <h5>Destino</h5>
                        <p>{ride.destination.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del viaje */}
                  <div className="ride-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-icon">🚗</span>
                        <span className="detail-text">Economy</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📏</span>
                        <span className="detail-text">{ride.distance || '5.2'} km</span>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-icon">⏱️</span>
                        <span className="detail-text">
                          {formatDuration(ride.duration || 720)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">⭐</span>
                        <span className="detail-text">4.8</span>
                      </div>
                    </div>
                  </div>

                  {/* Información del conductor */}
                  {ride.driverId && (
                    <div className="driver-section">
                      <div className="driver-info">
                        <div className="driver-avatar">
                          C
                        </div>
                        <div className="driver-details">
                          <h5>Carlos Mendoza</h5>
                          <p>Honda Civic 2022 • ⭐ 4.8</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="ride-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRideDetails(ride.id)}
                    >
                      Ver detalles
                    </Button>
                    {ride.status === 'completed' && (
                      <Button
                        size="sm"
                        onClick={() => handleRepeatRide(ride)}
                      >
                        Repetir viaje
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <footer className="history-footer">
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
            className="nav-item"
            onClick={() => navigate(ROUTES.PASSENGER.SHARED_RIDES)}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Compartidos</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="nav-item active"
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

export default RideHistoryPage;

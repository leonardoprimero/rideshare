import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used
import { useAuth } from '../../hooks/useAuth'; // To get current user if needed for context
import { useRides } from '../../hooks/useRides';
import { Ride } from '../../types'; // Ride is FrontendRide
import Loading from '../../components/ui/loading'; // Assuming a Loading component exists
// import { Button } from '../../components/ui/button'; // Assuming a Button component exists

const PassengerHomePage: React.FC = () => {
  const { user } = useAuth();
  const {
    availableRoutes,
    isLoading,
    error,
    getAvailableRoutes,
    joinRideAsPassenger,
    clearRideError,
  } = useRides();

  useEffect(() => {
    clearRideError(); // Clear previous errors
    getAvailableRoutes();
  }, [getAvailableRoutes, clearRideError]);

  const handleJoinRide = async (routeId: string) => {
    if (!user) {
      alert('Por favor, inicia sesión para unirte a un viaje.');
      return;
    }
    // Optional: check if user is already a passenger on this route? (Backend might handle this)
    const result = await joinRideAsPassenger(routeId);
    if (result.meta.requestStatus === 'fulfilled') {
      alert('Te has unido al viaje exitosamente!');
      // Optionally, refresh available routes or update UI based on the returned (updated) route
      getAvailableRoutes();
    } else {
      // Error is already in rideState.error, could display it more gracefully
      alert(`Error al unirse al viaje: ${(result.payload as string) || 'Error desconocido'}`);
    }
  };

  if (isLoading && availableRoutes.length === 0) {
    return <div className="container mx-auto p-4 text-center"><Loading /> Cargando rutas disponibles...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rutas Disponibles</h1>
      {availableRoutes.length === 0 && !isLoading && (
        <p>No hay rutas disponibles en este momento. ¡Vuelve a intentarlo más tarde!</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableRoutes.map((route: Ride) => (
          <div key={route.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Ruta de: {route.driverName}</h2>
            <p>Origen: {route.origin.address}</p>
            <p>Destino: {route.destination.address}</p>
            <p>Salida: {new Date(route.departureTime).toLocaleString()}</p>
            <p>Precio: ${route.price}</p>
            <p>Pasajeros actuales: {route.passengers?.length || 0}</p>
            {/* TODO: Add a Link to route details page if one exists */}
            {/* <Link to={`/routes/${route.id}`} className="text-blue-500 hover:underline">Ver Detalles</Link> */}
            { user && route.status === 'PENDING' && !route.passengers.find(p => p.id === user.id) && (
              <button
                onClick={() => handleJoinRide(route.id)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                disabled={isLoading} // Disable button while any ride operation is loading
              >
                {isLoading ? 'Procesando...' : 'Unirse al Viaje'}
              </button>
            )}
            {user && route.passengers.find(p => p.id === user.id) && (
              <p className="text-green-600 font-semibold mt-2">¡Ya estás en este viaje!</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerHomePage;

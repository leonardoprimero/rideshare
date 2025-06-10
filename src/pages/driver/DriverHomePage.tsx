import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRides } from '../../hooks/useRides';
import { Ride, RouteStatus } from '../../types';
import Loading from '../../components/ui/loading';
// import { Button } from '../../components/ui/button';
// import { Input } from '../../components/ui/input';
// import { Label } from '../../components/ui/label';

const DriverHomePage: React.FC = () => {
  const { user } = useAuth(); // Assuming user is a Driver
  const {
    driverRoutes,
    isLoading,
    error,
    getMyDriverRoutes,
    createNewRouteByDriver,
    updateRouteStatusByDriver,
    clearRideError,
  } = useRides();

  // Example state for a simple route creation form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newRouteData, setNewRouteData] = useState({
    originLat: '',
    originLng: '',
    destinationLat: '',
    destinationLng: '',
    departureTime: '', // Expects ISO string e.g., from <input type="datetime-local">
    price: '',
  });

  useEffect(() => {
    clearRideError();
    if (user?.isDriver) {
      getMyDriverRoutes();
    }
  }, [getMyDriverRoutes, user, clearRideError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRouteData({ ...newRouteData, [e.target.name]: e.target.value });
  };

  const handleCreateRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearRideError();

    // Basic validation
    if (!newRouteData.originLat || !newRouteData.originLng || !newRouteData.destinationLat || !newRouteData.destinationLng || !newRouteData.departureTime) {
      setFormError('Por favor, completa todos los campos de ubicación y hora de salida.');
      return;
    }
    
    const payload = {
      originLat: parseFloat(newRouteData.originLat),
      originLng: parseFloat(newRouteData.originLng),
      destinationLat: parseFloat(newRouteData.destinationLat),
      destinationLng: parseFloat(newRouteData.destinationLng),
      departureTime: new Date(newRouteData.departureTime).toISOString(),
      price: newRouteData.price ? parseFloat(newRouteData.price) : undefined,
    };

    const result = await createNewRouteByDriver(payload);
    if (result.meta.requestStatus === 'fulfilled') {
      alert('Ruta creada exitosamente!');
      setShowCreateForm(false);
      setNewRouteData({ originLat: '', originLng: '', destinationLat: '', destinationLng: '', departureTime: '', price: ''}); // Reset form
      // getMyDriverRoutes(); // Thunk already adds to state, or can refresh if needed
    } else {
      setFormError(`Error al crear ruta: ${(result.payload as string) || 'Error desconocido'}`);
    }
  };

  const handleStatusUpdate = async (routeId: string, newStatus: RouteStatus) => {
    clearRideError();
    const result = await updateRouteStatusByDriver(routeId, newStatus);
     if (result.meta.requestStatus === 'fulfilled') {
      alert('Estado de la ruta actualizado!');
      // getMyDriverRoutes(); // Thunk already updates state, or can refresh if needed
    } else {
      alert(`Error al actualizar estado: ${(result.payload as string) || 'Error desconocido'}`);
    }
  };


  if (isLoading && driverRoutes.length === 0 && !showCreateForm) {
    return <div className="container mx-auto p-4 text-center"><Loading /> Cargando tus rutas...</div>;
  }

  if (error && !showCreateForm) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!user?.isDriver) {
    return <div className="container mx-auto p-4 text-center">Esta página es solo para conductores.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Rutas Creadas</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancelar' : 'Crear Nueva Ruta'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateRouteSubmit} className="mb-6 p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Nueva Ruta</h2>
          {formError && <p className="text-red-500 mb-2">{formError}</p>}
          {/* Simplified form fields. In a real app, use proper input components and labels. */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <input type="number" step="any" name="originLat" value={newRouteData.originLat} onChange={handleInputChange} placeholder="Latitud Origen" required className="border p-2 rounded"/>
            <input type="number" step="any" name="originLng" value={newRouteData.originLng} onChange={handleInputChange} placeholder="Longitud Origen" required className="border p-2 rounded"/>
            <input type="number" step="any" name="destinationLat" value={newRouteData.destinationLat} onChange={handleInputChange} placeholder="Latitud Destino" required className="border p-2 rounded"/>
            <input type="number" step="any" name="destinationLng" value={newRouteData.destinationLng} onChange={handleInputChange} placeholder="Longitud Destino" required className="border p-2 rounded"/>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="datetime-local" name="departureTime" value={newRouteData.departureTime} onChange={handleInputChange} placeholder="Hora de Salida" required className="border p-2 rounded"/>
            <input type="number" step="any" name="price" value={newRouteData.price} onChange={handleInputChange} placeholder="Precio (opcional)" className="border p-2 rounded"/>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Confirmar Ruta'}
          </button>
        </form>
      )}

      {driverRoutes.length === 0 && !isLoading && !showCreateForm && (
        <p>Aún no has creado ninguna ruta.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {driverRoutes.map((route: Ride) => (
          <div key={route.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">De: {route.origin.address}</h3>
            <p>A: {route.destination.address}</p>
            <p>Salida: {new Date(route.departureTime).toLocaleString()}</p>
            <p>Precio: ${route.price}</p>
            <p>Estado: {route.status}</p>
            <p>Pasajeros: {route.passengers?.map(p => p.name || p.id).join(', ') || 'Ninguno'}</p>

            <div className="mt-2 space-x-2">
                {route.status === 'PENDING' && (
                    <button onClick={() => handleStatusUpdate(route.id, 'ACTIVE')} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Iniciar Viaje</button>
                )}
                {route.status === 'ACTIVE' && (
                    <button onClick={() => handleStatusUpdate(route.id, 'COMPLETED')} className="px-3 py-1 bg-green-500 text-white rounded text-sm">Completar Viaje</button>
                )}
                {(route.status === 'PENDING' || route.status === 'ACTIVE') && (
                     <button onClick={() => handleStatusUpdate(route.id, 'CANCELLED')} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Cancelar Viaje</button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverHomePage;

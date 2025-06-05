// Hook personalizado para viajes
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { 
  requestRide,
  getNearbyDrivers,
  acceptRide,
  updateRideStatus,
  loadRideHistory,
  loadSharedRides,
  joinSharedRide,
  createRecurringRide,
  loadDriverRecurringRides,
  loadPendingRides,
  clearCurrentRide,
  clearError,
  setCurrentRide,
  updateDriverLocationLocal,
  updateDriverAvailability
} from '../store/slices/rideSlice';
import { Location, Ride, RecurringRide } from '../types';

export const useRides = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rides = useSelector((state: RootState) => state.ride);

  // Acciones para pasajeros
  const requestNewRide = async (rideData: {
    passengerId: string;
    origin: { address: string; location: Location };
    destination: { address: string; location: Location };
    vehicleType?: 'economy' | 'comfort' | 'premium';
    scheduledFor?: string;
  }) => {
    return dispatch(requestRide(rideData));
  };

  const findNearbyDrivers = async (location: Location) => {
    return dispatch(getNearbyDrivers(location));
  };

  const loadMyRideHistory = async (userId: string) => {
    return dispatch(loadRideHistory(userId));
  };

  const loadAvailableSharedRides = async () => {
    return dispatch(loadSharedRides());
  };

  const joinSharedRideAction = async (rideId: string, passengerId: string) => {
    return dispatch(joinSharedRide({ rideId, passengerId }));
  };

  // Acciones para conductores
  const acceptRideRequest = async (rideId: string, driverId: string) => {
    return dispatch(acceptRide({ rideId, driverId }));
  };

  const updateCurrentRideStatus = async (rideId: string, status: Ride['status']) => {
    return dispatch(updateRideStatus({ rideId, status }));
  };

  const createNewRecurringRide = async (rideData: Omit<RecurringRide, 'id'>) => {
    return dispatch(createRecurringRide(rideData));
  };

  const loadMyRecurringRides = async (driverId: string) => {
    return dispatch(loadDriverRecurringRides(driverId));
  };

  const loadPendingRideRequests = async (driverLocation: Location) => {
    return dispatch(loadPendingRides(driverLocation));
  };

  // Acciones locales
  const clearCurrentRideLocal = () => {
    dispatch(clearCurrentRide());
  };

  const clearRideError = () => {
    dispatch(clearError());
  };

  const setCurrentRideLocal = (ride: Ride | null) => {
    dispatch(setCurrentRide(ride));
  };

  const updateDriverLocation = (driverId: string, location: Location) => {
    dispatch(updateDriverLocationLocal({ driverId, location }));
  };

  const toggleDriverAvailability = (driverId: string, isAvailable: boolean) => {
    dispatch(updateDriverAvailability({ driverId, isAvailable }));
  };

  return {
    // Estado
    currentRide: rides.currentRide,
    rideHistory: rides.rideHistory,
    nearbyDrivers: rides.nearbyDrivers,
    sharedRides: rides.sharedRides,
    recurringRides: rides.recurringRides,
    pendingRides: rides.pendingRides,
    isLoading: rides.isLoading,
    error: rides.error,

    // Acciones para pasajeros
    requestNewRide,
    findNearbyDrivers,
    loadMyRideHistory,
    loadAvailableSharedRides,
    joinSharedRide: joinSharedRideAction,

    // Acciones para conductores
    acceptRideRequest,
    updateCurrentRideStatus,
    createNewRecurringRide,
    loadMyRecurringRides,
    loadPendingRideRequests,

    // Acciones locales
    clearCurrentRide: clearCurrentRideLocal,
    clearError: clearRideError,
    setCurrentRide: setCurrentRideLocal,
    updateDriverLocation,
    toggleDriverAvailability,

    // Helpers
    hasActiveRide: !!rides.currentRide,
    hasRideHistory: rides.rideHistory.length > 0,
    hasNearbyDrivers: rides.nearbyDrivers.length > 0,
    hasSharedRides: rides.sharedRides.length > 0,
    hasPendingRides: rides.pendingRides.length > 0,
  };
};

export default useRides;

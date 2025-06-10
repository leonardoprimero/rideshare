import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  // Import the new thunks
  fetchAvailableRoutes,
  fetchRouteDetails,
  createDriverRoute,
  joinPassengerRoute,
  fetchDriverCreatedRoutes,
  updateDriverRouteStatus,
  // Import relevant actions from reducers if any are kept (e.g., error clearing)
  clearRideError,
  clearCurrentRouteDetails,
} from '../store/slices/rideSlice';
import { Ride, Location, RouteStatus } from '../types'; // Ride is FrontendRide
import { CreateRoutePayload } from '../services/rideService'; // For createDriverRoute payload

export const useRides = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rideState = useSelector((state: RootState) => state.ride); // Assuming 'ride' is the name of the slice in the root reducer

  // --- Actions that dispatch Thunks ---

  // For Passengers / General Users
  const getAvailableRoutes = () => {
    return dispatch(fetchAvailableRoutes());
  };

  const getRouteDetails = (routeId: string) => {
    return dispatch(fetchRouteDetails(routeId));
  };

  const joinRideAsPassenger = (routeId: string) => {
    return dispatch(joinPassengerRoute(routeId));
  };

  // For Drivers
  const createNewRouteByDriver = (routeData: CreateRoutePayload) => {
    return dispatch(createDriverRoute(routeData));
  };

  const getMyDriverRoutes = () => {
    // This thunk now correctly gets the driver's ID from the backend session
    return dispatch(fetchDriverCreatedRoutes());
  };

  const updateRouteStatusByDriver = (routeId: string, status: RouteStatus) => {
    return dispatch(updateDriverRouteStatus({ routeId, status }));
  };

  // --- Actions that dispatch Synchronous Reducers ---
  const clearRideSliceError = () => {
    dispatch(clearRideError());
  };

  const clearDetailsOfCurrentRoute = () => {
    dispatch(clearCurrentRouteDetails());
  };

  // --- State Selectors ---
  return {
    // State from rideSlice
    availableRoutes: rideState.availableRoutes,
    driverRoutes: rideState.driverRoutes,
    currentRouteDetails: rideState.currentRouteDetails,
    isLoading: rideState.isLoading,
    error: rideState.error,

    // Thunk-dispatching actions
    getAvailableRoutes,
    getRouteDetails,
    joinRideAsPassenger,
    createNewRouteByDriver,
    getMyDriverRoutes,
    updateRouteStatusByDriver,

    // Synchronous actions
    clearRideError: clearRideSliceError, // Renamed to avoid conflict if imported directly
    clearCurrentRouteDetails: clearDetailsOfCurrentRoute,

    // Derived/Helper states (optional, can also be computed in components)
    hasAvailableRoutes: rideState.availableRoutes.length > 0,
    // Add more helpers as needed
  };
};

export default useRides;

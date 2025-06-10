import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Ride, RouteStatus, Location, User } from '../../types'; // Ride is now FrontendRide
import { rideService, CreateRoutePayload } from '../../services/rideService'; // rideService is the new one

// Define the shape of the ride state
interface RideState {
  availableRoutes: Ride[];       // For passengers viewing available routes
  driverRoutes: Ride[];          // For drivers viewing their created routes
  currentRouteDetails: Ride | null; // For viewing details of a specific route
  isLoading: boolean;
  error: string | null;
  // Outdated/Mock-based state fields - to be reviewed/removed:
  // currentRide: Ride | null; // Replaced by currentRouteDetails or managed differently
  // rideHistory: Ride[]; // Will need a dedicated thunk if using client-side filtering from service or a backend endpoint
  // nearbyDrivers: Driver[]; // No backend endpoint for this yet
  // sharedRides: SharedRide[]; // No backend endpoint for this yet
  // recurringRides: RecurringRide[]; // No backend endpoint for this yet
  // pendingRides: Ride[]; // No backend endpoint for this concept yet
}

const initialState: RideState = {
  availableRoutes: [],
  driverRoutes: [],
  currentRouteDetails: null,
  isLoading: false,
  error: null,
};

// Async Thunks using the new rideService

export const fetchAvailableRoutes = createAsyncThunk<Ride[], void, { rejectValue: string }>(
  'ride/fetchAvailableRoutes',
  async (_, { rejectWithValue }) => {
    try {
      const routes = await rideService.getAvailableRoutes();
      return routes;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch available routes');
    }
  }
);

export const fetchRouteDetails = createAsyncThunk<Ride | null, string, { rejectValue: string }>(
  'ride/fetchRouteDetails',
  async (routeId, { rejectWithValue }) => {
    try {
      const route = await rideService.getRouteById(routeId);
      return route;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch route details');
    }
  }
);

export const createDriverRoute = createAsyncThunk<Ride, CreateRoutePayload, { rejectValue: string }>(
  'ride/createDriverRoute',
  async (routeData, { rejectWithValue }) => {
    try {
      const newRoute = await rideService.createDriverRoute(routeData);
      return newRoute;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create route');
    }
  }
);

export const joinPassengerRoute = createAsyncThunk<Ride, string, { rejectValue: string }>(
  'ride/joinPassengerRoute',
  async (routeId, { rejectWithValue }) => {
    try {
      const updatedRoute = await rideService.joinRoute(routeId);
      return updatedRoute;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to join route');
    }
  }
);

export const fetchDriverCreatedRoutes = createAsyncThunk<Ride[], void, { rejectValue: string }>(
  'ride/fetchDriverCreatedRoutes',
  async (_, { rejectWithValue }) => { // Assumes driver ID is handled by backend via auth token
    try {
      const routes = await rideService.getDriverCreatedRoutes();
      return routes;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch driver routes');
    }
  }
);

export const updateDriverRouteStatus = createAsyncThunk<Ride, { routeId: string; status: RouteStatus }, { rejectValue: string }>(
  'ride/updateDriverRouteStatus',
  async ({ routeId, status }, { rejectWithValue }) => {
    try {
      const updatedRoute = await rideService.updateDriverRouteStatus(routeId, status);
      return updatedRoute;
    } catch (error: any) { // Corrected catch block
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update route status');
    }
  }
);

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    clearRideError: (state) => {
      state.error = null;
    },
    clearCurrentRouteDetails: (state) => {
      state.currentRouteDetails = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Available Routes
    builder.addCase(fetchAvailableRoutes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAvailableRoutes.fulfilled, (state, action: PayloadAction<Ride[]>) => {
      state.isLoading = false;
      state.availableRoutes = action.payload;
    });
    builder.addCase(fetchAvailableRoutes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Route Details
    builder.addCase(fetchRouteDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchRouteDetails.fulfilled, (state, action: PayloadAction<Ride | null>) => {
      state.isLoading = false;
      state.currentRouteDetails = action.payload;
    });
    builder.addCase(fetchRouteDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Driver Route
    builder.addCase(createDriverRoute.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createDriverRoute.fulfilled, (state, action: PayloadAction<Ride>) => {
      state.isLoading = false;
      state.driverRoutes.unshift(action.payload);
    });
    builder.addCase(createDriverRoute.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Join Passenger Route
    builder.addCase(joinPassengerRoute.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(joinPassengerRoute.fulfilled, (state, action: PayloadAction<Ride>) => {
      state.isLoading = false;
      state.availableRoutes = state.availableRoutes.map(r => r.id === action.payload.id ? action.payload : r);
      if (state.currentRouteDetails?.id === action.payload.id) {
        state.currentRouteDetails = action.payload;
      }
    });
    builder.addCase(joinPassengerRoute.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Driver Created Routes
    builder.addCase(fetchDriverCreatedRoutes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDriverCreatedRoutes.fulfilled, (state, action: PayloadAction<Ride[]>) => {
      state.isLoading = false;
      state.driverRoutes = action.payload;
    });
    builder.addCase(fetchDriverCreatedRoutes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Driver Route Status
    builder.addCase(updateDriverRouteStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateDriverRouteStatus.fulfilled, (state, action: PayloadAction<Ride>) => {
      state.isLoading = false;
      state.driverRoutes = state.driverRoutes.map(r => r.id === action.payload.id ? action.payload : r);
      state.availableRoutes = state.availableRoutes.map(r => r.id === action.payload.id ? action.payload : r)
                                .filter(r => r.status === 'PENDING');
      if (state.currentRouteDetails?.id === action.payload.id) {
        state.currentRouteDetails = action.payload;
      }
    });
    builder.addCase(updateDriverRouteStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearRideError, clearCurrentRouteDetails } = rideSlice.actions;
export default rideSlice.reducer;

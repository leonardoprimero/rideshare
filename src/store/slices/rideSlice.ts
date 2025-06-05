import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Ride, Driver, SharedRide, RecurringRide, Location } from '../../types';
import { rideService } from '../../services/rideService';

// Estado inicial para los viajes
interface RideState {
  currentRide: Ride | null;
  rideHistory: Ride[];
  nearbyDrivers: Driver[];
  sharedRides: SharedRide[];
  recurringRides: RecurringRide[];
  pendingRides: Ride[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RideState = {
  currentRide: null,
  rideHistory: [],
  nearbyDrivers: [],
  sharedRides: [],
  recurringRides: [],
  pendingRides: [],
  isLoading: false,
  error: null,
};

// Thunks para operaciones asíncronas de viajes
export const requestRide = createAsyncThunk(
  'ride/requestRide',
  async (rideData: {
    passengerId: string;
    origin: { address: string; location: Location };
    destination: { address: string; location: Location };
    vehicleType?: 'economy' | 'comfort' | 'premium';
    scheduledFor?: string;
  }, { rejectWithValue }) => {
    try {
      const ride = await rideService.requestRide(rideData);
      return ride;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al solicitar viaje');
    }
  }
);

export const getNearbyDrivers = createAsyncThunk(
  'ride/getNearbyDrivers',
  async ({ latitude, longitude }: { latitude: number; longitude: number }, { rejectWithValue }) => {
    try {
      const drivers = await rideService.getNearbyDrivers({ latitude, longitude });
      return drivers;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener conductores cercanos');
    }
  }
);

export const acceptRide = createAsyncThunk(
  'ride/acceptRide',
  async ({ rideId, driverId }: { rideId: string; driverId: string }, { rejectWithValue }) => {
    try {
      const ride = await rideService.acceptRide(rideId, driverId);
      return ride;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al aceptar viaje');
    }
  }
);

export const updateRideStatus = createAsyncThunk(
  'ride/updateStatus',
  async ({ rideId, status }: { rideId: string; status: Ride['status'] }, { rejectWithValue }) => {
    try {
      const ride = await rideService.updateRideStatus(rideId, status);
      return ride;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar estado del viaje');
    }
  }
);

export const loadRideHistory = createAsyncThunk(
  'ride/loadHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const history = rideService.getRideHistory(userId);
      return history;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar historial');
    }
  }
);

export const loadSharedRides = createAsyncThunk(
  'ride/loadSharedRides',
  async (_, { rejectWithValue }) => {
    try {
      const sharedRides = rideService.getSharedRides();
      return sharedRides;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar viajes compartidos');
    }
  }
);

export const joinSharedRide = createAsyncThunk(
  'ride/joinSharedRide',
  async ({ rideId, passengerId }: { rideId: string; passengerId: string }, { rejectWithValue }) => {
    try {
      const ride = await rideService.joinSharedRide(rideId, passengerId);
      return ride;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al unirse al viaje compartido');
    }
  }
);

export const createRecurringRide = createAsyncThunk(
  'ride/createRecurringRide',
  async (rideData: Omit<RecurringRide, 'id'>, { rejectWithValue }) => {
    try {
      const ride = await rideService.createRecurringRide(rideData);
      return ride;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al crear viaje recurrente');
    }
  }
);

export const loadDriverRecurringRides = createAsyncThunk(
  'ride/loadDriverRecurringRides',
  async (driverId: string, { rejectWithValue }) => {
    try {
      const rides = rideService.getDriverRecurringRides(driverId);
      return rides;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar viajes recurrentes');
    }
  }
);

export const loadPendingRides = createAsyncThunk(
  'ride/loadPendingRides',
  async (driverLocation: Location, { rejectWithValue }) => {
    try {
      const rides = rideService.getPendingRides(driverLocation);
      return rides;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar viajes pendientes');
    }
  }
);

// Slice de viajes
const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    clearCurrentRide: (state) => {
      state.currentRide = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },
    updateDriverLocationLocal: (state, action) => {
      // Actualizar ubicación de conductores localmente
      const { driverId, location } = action.payload;
      state.nearbyDrivers = state.nearbyDrivers.map(driver =>
        driver.id === driverId ? { ...driver, location } : driver
      );
    },
    updateDriverAvailability: (state, action) => {
      const { driverId, isAvailable } = action.payload;
      state.nearbyDrivers = state.nearbyDrivers.map(driver =>
        driver.id === driverId ? { ...driver, isAvailable } : driver
      );
    },
  },
  extraReducers: (builder) => {
    // Request Ride
    builder.addCase(requestRide.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(requestRide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentRide = action.payload;
    });
    builder.addCase(requestRide.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get Nearby Drivers
    builder.addCase(getNearbyDrivers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getNearbyDrivers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.nearbyDrivers = action.payload;
    });
    builder.addCase(getNearbyDrivers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Accept Ride
    builder.addCase(acceptRide.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(acceptRide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentRide = action.payload;
    });
    builder.addCase(acceptRide.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Ride Status
    builder.addCase(updateRideStatus.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateRideStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentRide = action.payload;
      
      // Si el viaje se completó o canceló, moverlo al historial
      if (action.payload.status === 'completed' || action.payload.status === 'cancelled') {
        state.rideHistory = [action.payload, ...state.rideHistory];
        state.currentRide = null;
      }
    });
    builder.addCase(updateRideStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Load Ride History
    builder.addCase(loadRideHistory.fulfilled, (state, action) => {
      state.rideHistory = action.payload;
    });

    // Load Shared Rides
    builder.addCase(loadSharedRides.fulfilled, (state, action) => {
      state.sharedRides = action.payload;
    });

    // Join Shared Ride
    builder.addCase(joinSharedRide.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(joinSharedRide.fulfilled, (state, action) => {
      state.isLoading = false;
      // Actualizar el viaje compartido en la lista
      state.sharedRides = state.sharedRides.map(ride =>
        ride.id === action.payload.id ? action.payload : ride
      );
    });
    builder.addCase(joinSharedRide.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Recurring Ride
    builder.addCase(createRecurringRide.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createRecurringRide.fulfilled, (state, action) => {
      state.isLoading = false;
      state.recurringRides = [action.payload, ...state.recurringRides];
    });
    builder.addCase(createRecurringRide.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Load Driver Recurring Rides
    builder.addCase(loadDriverRecurringRides.fulfilled, (state, action) => {
      state.recurringRides = action.payload;
    });

    // Load Pending Rides
    builder.addCase(loadPendingRides.fulfilled, (state, action) => {
      state.pendingRides = action.payload;
    });
  },
});

export const { 
  clearCurrentRide, 
  clearError,
  setCurrentRide,
  updateDriverLocationLocal,
  updateDriverAvailability
} = rideSlice.actions;
export default rideSlice.reducer;

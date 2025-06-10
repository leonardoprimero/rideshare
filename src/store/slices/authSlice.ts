import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types'; // Frontend User type
import { authService, AuthResponse, BackendUser, RegisterData as BackendRegisterData } from '../../services/authService';
import { RootState } from '../store'; // For getState type

// Define the shape of data components will pass for registration
export interface UIRegisterData {
  name: string;
  email: string;
  phone: string; // Keep for UI form, even if not sent to backend directly
  password: string;
  isDriver: boolean; // UI uses this
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Thunks
export const checkAuth = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.fetchCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials.email, credentials.password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error al iniciar sesión');
    }
  }
);

export const registerUser = createAsyncThunk<
  { success: boolean; message: string; userId?: string },
  UIRegisterData,
  { rejectValue: string }
>(
  'auth/register',
  async (uiUserData, { rejectWithValue }) => {
    try {
      const backendRegisterPayload: BackendRegisterData = {
          name: uiUserData.name,
          email: uiUserData.email,
          password: uiUserData.password,
          role: uiUserData.isDriver ? 'DRIVER' : 'PASSENGER'
      };
      const response = await authService.register(backendRegisterPayload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error al registrar usuario');
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cerrar sesión');
    }
  }
);

export const updateUserProfile = createAsyncThunk<User | null, Partial<{name: string}>, { state: RootState, rejectValue: string }>(
  'auth/updateProfile',
  async (updates, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState(); // RootState is used here
      if (!auth.user) {
        return rejectWithValue('User not authenticated');
      }
      const updatedUser = await authService.updateUser(auth.user.id, updates);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error al actualizar perfil');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

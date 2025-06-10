import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  loginUser,
  registerUser as registerUserThunk,
  logoutUser,
  clearError,
  updateUserProfile,
  checkAuth,
  UIRegisterData
} from '../store/slices/authSlice';
import { User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    return dispatch(loginUser({ email, password }));
  };

  const register = async (userData: UIRegisterData) => {
    return dispatch(registerUserThunk(userData));
  };

  const signOut = () => {
    dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const updateProfile = async (updates: Partial<{name: string}>) => {
    return dispatch(updateUserProfile(updates));
  };

  const initializeAuth = () => {
    dispatch(checkAuth());
  };

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    
    // Actions
    login,
    register,
    logout: signOut,
    clearError: clearAuthError,
    updateProfile,
    initializeAuth,
    
    // Helpers
    isDriver: auth.user?.isDriver || false,
    isPassenger: auth.user ? !auth.user.isDriver : false,
  };
};

export default useAuth;

// Hook personalizado para autenticación
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loginUser, registerUser, logout, clearError, updateUserProfile } from '../store/slices/authSlice';
import { RegisterData } from '../services/authService';
import { User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    return dispatch(loginUser({ email, password }));
  };

  const register = async (userData: RegisterData) => {
    return dispatch(registerUser(userData));
  };

  const signOut = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!auth.user) return;
    return dispatch(updateUserProfile(updates));
  };

  return {
    // Estado
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    
    // Acciones
    login,
    register,
    logout: signOut,
    clearError: clearAuthError,
    updateProfile,
    
    // Helpers
    isDriver: auth.user?.isDriver || false,
    isPassenger: !auth.user?.isDriver,
  };
};

export default useAuth;

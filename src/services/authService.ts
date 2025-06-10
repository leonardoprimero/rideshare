import axios from 'axios'; // Added for isAxiosError
import apiClient from '../lib/api';
import { User } from '../types'; // Assuming Role in types might be 'driver'/'passenger' strings

// Backend expects Role as 'DRIVER' or 'PASSENGER'
type BackendRole = 'DRIVER' | 'PASSENGER';

// Interface for backend user data, adjust if backend sends different structure
export interface BackendUser {
  id: string;
  email: string;
  name: string | null;
  role: BackendRole;
  // Add other fields backend might send, like createdAt, updatedAt
}

// Interface for what frontend components/store expect (from ../types/User)
// This might require mapping if BackendUser is different from User
const mapBackendUserToFrontendUser = (backendUser: BackendUser): User => {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name || '', // Handle null name
    isDriver: backendUser.role === 'DRIVER',
    // Add other fields like phone, rating, profilePicture if available from backend
    // For now, provide defaults or leave them out if not sent by /me or /login
    phone: '', // Placeholder
    rating: 0, // Placeholder
    profilePicture: '', // Placeholder
  };
};

export interface AuthResponse {
  user: User; // Frontend User type
  token?: string; // Token might not be explicitly sent in body if using httpOnly cookies
}

// This is the payload structure the backend's /auth/register endpoint expects
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: BackendRole; // 'DRIVER' or 'PASSENGER'
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<{ user: BackendUser; token?: string }>('/auth/login', { email, password });
    return {
      user: mapBackendUserToFrontendUser(response.data.user),
      token: response.data.token,
    };
  }

  async register(userData: RegisterData): Promise<{ success: boolean; message: string; userId?: string }> {
    const response = await apiClient.post<{ message: string; userId: string }>('/auth/register', userData);
    return { success: true, ...response.data };
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  async fetchCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<BackendUser>('/users/me'); // Or /auth/me
      return mapBackendUserToFrontendUser(response.data);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<{ name: string }>): Promise<User | null> {
    // userId is not used by /users/me, but kept for potential future flexibility
    try {
        const response = await apiClient.put<BackendUser>('/users/me', { name: updates.name });
        return mapBackendUserToFrontendUser(response.data);
    } catch (error) {
        console.error("Error updating user profile via service:", error);
        throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;

// Re-export RegisterData for clarity if other parts of the frontend (e.g. thunks before mapping)
// refer to the specific payload for the backend.
export type { RegisterData as BackendRegisterPayload };

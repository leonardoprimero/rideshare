// Servicio de autenticación con localStorage
import { User } from '../types';
import { mockPassengers, mockDrivers } from '../data/mockData';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  isDriver: boolean;
}

class AuthService {
  private readonly TOKEN_KEY = 'shareride_token';
  private readonly USER_KEY = 'shareride_user';
  private readonly USERS_KEY = 'shareride_users';

  constructor() {
    // Inicializar datos de demostración en localStorage si no existen
    this.initializeDemoData();
    this.createQuickTestUsers(); // Ensure demo users are available
  }

  private initializeDemoData(): void {
    const existingUsers = localStorage.getItem(this.USERS_KEY);
    if (!existingUsers) {
      // Combinar usuarios pasajeros y conductores
      const allUsers = [
        ...mockPassengers,
        ...mockDrivers.map(driver => ({
          id: driver.userId,
          name: driver.name,
          email: `${driver.name.toLowerCase().replace(/\s+/g, '.')}@shareride.com`,
          phone: `+54 387 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
          rating: driver.rating,
          profilePicture: driver.profilePicture,
          isDriver: true
        }))
      ];
      
      localStorage.setItem(this.USERS_KEY, JSON.stringify(allUsers));
    }
  }

  private getAllUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private generateToken(): string {
    return `shareride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getAllUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          reject(new Error('Usuario no encontrado'));
          return;
        }

        // En demo, cualquier password funciona excepto 'wrong'
        if (password === 'wrong') {
          reject(new Error('Contraseña incorrecta'));
          return;
        }

        const token = this.generateToken();
        const authResponse: AuthResponse = { user, token };

        // Guardar en localStorage
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        resolve(authResponse);
      }, 1000); // Simular delay de red
    });
  }

  async register(userData: RegisterData): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getAllUsers();
        
        // Verificar si el email ya existe
        const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (existingUser) {
          reject(new Error('El email ya está registrado'));
          return;
        }

        // Crear nuevo usuario
        const newUser: User = {
          id: `user_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          rating: 5.0, // Usuarios nuevos empiezan con rating perfecto
          isDriver: userData.isDriver,
          profilePicture: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150`
        };

        // Agregar a la lista de usuarios
        users.push(newUser);
        this.saveUsers(users);

        resolve({
          success: true,
          message: 'Usuario registrado correctamente'
        });
      }, 1500); // Simular delay de red más largo para registro
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  updateUser(updates: Partial<User>): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      this.saveUsers(users);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }

    return null;
  }

  // Métodos para obtener datos de demostración
  getDemoPassengers(): User[] {
    return this.getAllUsers().filter(u => !u.isDriver);
  }

  getDemoDrivers(): User[] {
    return this.getAllUsers().filter(u => u.isDriver);
  }

  // Método para crear usuarios de prueba rápida
  createQuickTestUsers(): void {
    const testUsers: User[] = [
      {
        id: 'demo_passenger_1',
        name: 'Demo Passenger',
        email: 'passenger1@demo.com',
        phone: '+54 9 387 111 2222',
        rating: 4.7,
        isDriver: false,
        profilePicture: 'https://randomuser.me/api/portraits/women/75.jpg'
      },
      {
        id: 'demo_driver_1',
        name: 'Demo Driver',
        email: 'driver1@demo.com',
        phone: '+54 9 387 333 4444',
        rating: 4.9,
        isDriver: true,
        profilePicture: 'https://randomuser.me/api/portraits/men/75.jpg'
        // Add any driver-specific fields if needed by other parts of the app,
        // e.g., carDetails: { model: 'Toyota Corolla', licensePlate: 'AB123CD' }
      }
    ];

    const existingUsers = this.getAllUsers();
    let usersModified = false;

    testUsers.forEach(testUser => {
      const existingIndex = existingUsers.findIndex(u => u.id === testUser.id || u.email === testUser.email);
      if (existingIndex === -1) {
        // Add if doesn't exist
        existingUsers.push(testUser);
        usersModified = true;
      } else {
        // Optionally, update if exists but you want to ensure specific fields are set
        // For this case, we'll just ensure it exists. If you need to overwrite:
        // existingUsers[existingIndex] = { ...existingUsers[existingIndex], ...testUser };
        // usersModified = true;
      }
    });

    if (usersModified) {
      this.saveUsers(existingUsers);
    }
  }
}

export const authService = new AuthService();
export default authService;

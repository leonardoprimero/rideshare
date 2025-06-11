import { Response } from 'express'; // Removed Request as it's part of AuthenticatedRequest
import { createUser, findUserByEmail, verifyPassword, findUserById } from '../services/userService'; // Added findUserById
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middlewares/authMiddleware'; // Import AuthenticatedRequest

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }
    const userRole = role && ['DRIVER', 'PASSENGER'].includes(role.toUpperCase()) ? role.toUpperCase() : 'PASSENGER';
    const user = await createUser({ email, password, name, role: userRole });
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials (user not found)' });
      return;
    }
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
      return;
    }
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Forzar true, asumiendo HTTPS en Cloud Workstations
      sameSite: 'None', // Necesario para cross-domain cookies con credentials
      path: '/',      // Asegurar disponibilidad en todas las rutas del API
      maxAge: 3600000,
    });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

export const logout = (req: AuthenticatedRequest, res: Response): void => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logout successful' });
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || !req.user.userId) { // Check for userId specifically
    res.status(401).json({ message: "Not authenticated or user ID missing in token" });
    return;
  }
  try {
    // Use findUserById with the userId from the token
    const user = await findUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Return non-sensitive user information
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching /me:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

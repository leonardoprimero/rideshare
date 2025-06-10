import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key'; // Use environment variable

export interface AuthenticatedRequest extends Request {
  user?: any; // Define a more specific type for user based on your JWT payload
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add decoded user payload to request object
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

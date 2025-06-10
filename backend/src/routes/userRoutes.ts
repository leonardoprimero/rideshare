import { Router } from 'express';
import { handleGetUserProfile, handleUpdateUserProfile } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/users/me - Get current user's profile
router.get('/me', authenticateToken, handleGetUserProfile);

// PUT /api/users/me - Update current user's profile
router.put('/me', authenticateToken, handleUpdateUserProfile);

export default router;

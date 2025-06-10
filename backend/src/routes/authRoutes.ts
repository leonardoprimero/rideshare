import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController'; // Added me
import { authenticateToken } from '../middlewares/authMiddleware'; // Ensure this is imported

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken, me); // Protected route

export default router;

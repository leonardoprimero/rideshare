import { Router } from 'express';
import { handleCreateRoute, handleGetRouteById, handleGetAllAvailableRoutes, handlePassengerJoinRoute, handleGetDriverRoutes, handleUpdateRouteStatus } from '../controllers/routeController';
import { authenticateToken } from '../middlewares/authMiddleware';
// We might need a specific role check middleware later, for now controller handles it.

const router = Router();

// POST /api/routes - Create a new route (Driver only)
router.post('/', authenticateToken, handleCreateRoute);

// GET /api/routes/:id - Get a specific route by ID (Authenticated users)
router.get('/:id', authenticateToken, handleGetRouteById);

// GET /api/routes - Get all available routes (Authenticated users)
router.get('/', authenticateToken, handleGetAllAvailableRoutes);

// POST /api/routes/:id/join - Passenger joins a route (Authenticated users)
router.post('/:id/join', authenticateToken, handlePassengerJoinRoute);

// GET /api/routes/driver/my-routes - Get all routes for the authenticated driver
router.get('/driver/my-routes', authenticateToken, handleGetDriverRoutes);

// PUT /api/routes/:id/status - Driver updates status of their route
router.put('/:id/status', authenticateToken, handleUpdateRouteStatus);

// More routes will be added here

export default router;

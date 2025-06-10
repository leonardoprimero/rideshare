import { Router } from 'express';
import { handleRecordPayment, handleGetMyPayments, handleGetPaymentDetails } from '../controllers/paymentController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/payments/record - Record a new payment (Driver or Admin)
router.post('/record', authenticateToken, handleRecordPayment);

// GET /api/payments/my-payments - Get payments for the authenticated user (Passenger)
router.get('/my-payments', authenticateToken, handleGetMyPayments);

// GET /api/payments/:id - Get specific payment details (Passenger who paid, Driver of the route, or Admin)
router.get('/:id', authenticateToken, handleGetPaymentDetails);


export default router;

import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { recordPayment, getPaymentsByUserId, getPaymentById } from '../services/paymentService';
import { PaymentStatus, Role } from '@prisma/client'; // For status validation & role checks
import { findRouteById } from '../services/routeService'; // To get route price


export const handleRecordPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { routeId, passengerId, amount, status } = req.body;
    const requesterId = req.user?.userId;
    const requesterRole = req.user?.role;

    if (!requesterId) {
      res.status(403).json({ message: "User ID not found in token." });
      return;
    }

    // Authorization: Who can record a payment?
    // Option 1: Only the driver of the route.
    // Option 2: An admin.
    // Option 3: The passenger themselves (less likely for "recording" by others).
    // Let's assume for now driver of the route or an ADMIN.

    const route = await findRouteById(routeId);
    if (!route) {
        res.status(404).json({ message: "Route not found."});
        return;
    }

    if (requesterRole !== Role.ADMIN && route.driverId !== requesterId) {
        res.status(403).json({ message: "Forbidden: Only the route driver or an admin can record this payment." });
        return;
    }

    if (!routeId || !passengerId || typeof amount !== 'number') {
      res.status(400).json({ message: 'Route ID, Passenger ID, and a numeric amount are required.' });
      return;
    }
    if (amount <= 0) {
        res.status(400).json({ message: 'Amount must be positive.' });
        return;
    }

    const paymentData = {
      routeId,
      passengerId,
      amount,
      status: status && Object.values(PaymentStatus).includes(status as PaymentStatus) ? status as PaymentStatus : PaymentStatus.PENDING,
    };

    const payment = await recordPayment(paymentData);
    res.status(201).json(payment);
  } catch (error) {
    console.error("Error recording payment:", error);
    if (error instanceof Error) {
        if (error.message.includes("Route not found") || error.message.includes("passenger not associated")) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes("Route does not have a defined price")) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error while recording payment.' });
        }
    } else {
         res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }
};

export const handleGetMyPayments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if(!userId) {
            res.status(401).json({ message: "User not authenticated."});
            return;
        }
        const payments = await getPaymentsByUserId(userId);
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error fetching user payments:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const handleGetPaymentDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const paymentId = req.params.id;
        const userId = req.user?.userId; // For authorization

        const payment = await getPaymentById(paymentId);
        if(!payment) {
            res.status(404).json({ message: "Payment not found."});
            return;
        }

        // Authorization: User can see their own payments, or driver of the route, or admin
        const route = await findRouteById(payment.routeId); // Fetch route for driverId
        if (!route) {
             res.status(404).json({ message: "Associated route not found."}); // Should not happen if DB is consistent
             return;
        }

        if (payment.userId !== userId && route.driverId !== userId && req.user?.role !== Role.ADMIN) {
            res.status(403).json({ message: "Forbidden: You do not have access to this payment record." });
            return;
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

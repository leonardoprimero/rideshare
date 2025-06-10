import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { createRoute, findRouteById, getAllAvailableRoutes, addPassengerToRoute, getRoutesByDriverId, updateRouteStatusByDriver } from '../services/routeService';
import { Role, RouteStatus } from '@prisma/client'; // Import Role enum, Added RouteStatus

export const handleCreateRoute = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { originLat, originLng, destinationLat, destinationLng, departureTime, estimatedArrivalTime, price } = req.body;
    const driverId = req.user?.userId;

    if (!driverId) {
      res.status(403).json({ message: 'User ID not found in token.' });
      return;
    }
    if (req.user?.role !== Role.DRIVER) {
        res.status(403).json({ message: 'Forbidden: Only drivers can create routes.' });
        return;
    }

    if (!originLat || !originLng || !destinationLat || !destinationLng || !departureTime) {
      res.status(400).json({ message: 'Missing required route information.' });
      return;
    }

    const routeData = {
      originLat: parseFloat(originLat),
      originLng: parseFloat(originLng),
      destinationLat: parseFloat(destinationLat),
      destinationLng: parseFloat(destinationLng),
      departureTime: new Date(departureTime),
      estimatedArrivalTime: estimatedArrivalTime ? new Date(estimatedArrivalTime) : undefined,
      price: price ? parseFloat(price) : undefined,
      driverId,
    };

    const route = await createRoute(routeData);
    res.status(201).json(route);
  } catch (error) {
    console.error('Error creating route:', error);
    if (error instanceof Error && error.message.includes("Invalid `new Date()`")) {
        res.status(400).json({ message: 'Invalid date format for departureTime or estimatedArrivalTime.' });
    } else {
        res.status(500).json({ message: 'Internal server error while creating route.' });
    }
  }
};

export const handleGetRouteById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const route = await findRouteById(id);
    if (!route) {
      res.status(404).json({ message: 'Route not found' });
      return;
    }
    res.status(200).json(route);
  } catch (error) {
    console.error('Error fetching route by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const handleGetAllAvailableRoutes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const routes = await getAllAvailableRoutes();
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error fetching available routes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// More handlers will be added here
export const handlePassengerJoinRoute = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: routeId } = req.params; // routeId from URL parameter
    const passengerId = req.user?.userId;

    if (!passengerId) {
      res.status(403).json({ message: "User ID not found in token. Cannot join route." });
      return;
    }

    // Optional: Check if user is a PASSENGER explicitly, if desired.
    // For now, any authenticated user can attempt to join.
    // if (req.user?.role !== Role.PASSENGER) {
    //   res.status(403).json({ message: "Forbidden: Only passengers can join routes." });
    //   return;
    // }

    const updatedRoute = await addPassengerToRoute(routeId, passengerId);
    res.status(200).json(updatedRoute);
  } catch (error) {
    console.error("Error joining route:", error);
    if (error instanceof Error) {
        if (error.message.includes("Route not found")) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes("not available for joining")) {
            res.status(400).json({ message: error.message });
        } else if (error.message.includes("Can't reach database server")) {
             res.status(503).json({ message: "Database temporarily unavailable." });
        } else {
            res.status(500).json({ message: "Internal server error while joining route." });
        }
    } else {
        res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
};

export const handleGetDriverRoutes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const driverId = req.user?.userId;
    if (!driverId) {
      res.status(403).json({ message: "User ID not found in token." });
      return;
    }
    // No explicit role check needed here if we fetch by driverId from token,
    // but ensuring the user IS a driver could be an extra check.
    // if (req.user?.role !== Role.DRIVER) {
    //   res.status(403).json({ message: "Forbidden: Only drivers can view their routes this way." });
    //   return;
    // }

    const routes = await getRoutesByDriverId(driverId);
    res.status(200).json(routes);
  } catch (error) {
    console.error("Error fetching driver routes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const handleUpdateRouteStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: routeId } = req.params;
    const driverId = req.user?.userId;
    const { status } = req.body; // Expecting new status in request body

    if (!driverId) {
      res.status(403).json({ message: "User ID not found in token." });
      return;
    }
    if (req.user?.role !== Role.DRIVER) {
        res.status(403).json({ message: "Forbidden: Only drivers can update routes." });
        return;
    }
    if (!status || !Object.values(RouteStatus).includes(status as RouteStatus)) {
        res.status(400).json({ message: "Invalid or missing status provided. Valid statuses are: PENDING, ACTIVE, COMPLETED, CANCELLED." });
        return;
    }

    const updatedRoute = await updateRouteStatusByDriver(routeId, driverId, status as RouteStatus);
    res.status(200).json(updatedRoute);
  } catch (error) {
    console.error("Error updating route status:", error);
     if (error instanceof Error) {
        if (error.message.includes("Route not found")) {
            res.status(404).json({ message: error.message });
        } else if (error.message.includes("Forbidden")) {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error while updating status." });
        }
    } else {
        res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
};

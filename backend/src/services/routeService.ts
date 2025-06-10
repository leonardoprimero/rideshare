import { PrismaClient, Route, User, RouteStatus } from '@prisma/client'; // Added RouteStatus

const prisma = new PrismaClient();

interface RouteCreationData {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  departureTime: Date;
  estimatedArrivalTime?: Date;
  price?: number;
  driverId: string;
}

export const createRoute = async (data: RouteCreationData): Promise<Route> => {
  return prisma.route.create({
    data: {
      ...data,
      status: 'PENDING', // Default status
    },
  });
};

export const findRouteById = async (routeId: string): Promise<Route | null> => {
  return prisma.route.findUnique({
    where: { id: routeId },
    include: {
      driver: {
        select: { id: true, name: true, email: true } // Select driver details
      },
      passengers: {
        select: { id: true, name: true, email: true } // Select passenger details
      }
    }
  });
};

export const getAllAvailableRoutes = async (): Promise<Route[]> => {
  return prisma.route.findMany({
    where: {
      status: 'PENDING', // Only show routes that are available for booking
      // Potentially add other filters like departureTime > now
    },
    include: {
      driver: {
        select: { id: true, name: true, email: true }
      },
    },
    orderBy: {
      departureTime: 'asc',
    },
  });
};

// More functions will be added here: for joining, updating status, etc.
export const addPassengerToRoute = async (routeId: string, passengerId: string): Promise<Route | null> => {
  // First, check if the route exists and is available
  const route = await prisma.route.findUnique({
    where: { id: routeId },
  });

  if (!route) {
    throw new Error("Route not found");
  }

  if (route.status !== "PENDING") {
    throw new Error("Route is not available for joining (not PENDING)");
  }

  // Potentially add checks for route capacity if a 'capacity' field were added to Route model

  // Add passenger to the route
  return prisma.route.update({
    where: { id: routeId },
    data: {
      passengers: {
        connect: { id: passengerId },
      },
    },
    include: {
      passengers: { select: { id: true, name: true } }, // Include updated passenger list
      driver: { select: { id: true, name: true } },
    }
  });
};

export const getRoutesByDriverId = async (driverId: string): Promise<Route[]> => {
  return prisma.route.findMany({
    where: { driverId },
    include: {
      passengers: { select: { id: true, name: true, email: true } }, // Include passengers for each route
    },
    orderBy: {
      departureTime: 'desc', // Show most recent first, or as preferred
    },
  });
};

export const updateRouteStatusByDriver = async (routeId: string, driverId: string, newStatus: RouteStatus): Promise<Route | null> => {
  // First, verify the route exists and belongs to the driver
  const route = await prisma.route.findUnique({
    where: { id: routeId },
  });

  if (!route) {
    throw new Error("Route not found");
  }

  if (route.driverId !== driverId) {
    throw new Error("Forbidden: Driver does not own this route");
  }

  // Potentially add logic here to validate status transitions (e.g., cannot go from COMPLETED to PENDING)

  return prisma.route.update({
    where: { id: routeId },
    data: { status: newStatus },
    include: {
      driver: { select: { id: true, name: true } },
      passengers: { select: { id: true, name: true } },
    }
  });
};

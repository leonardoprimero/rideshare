import { PrismaClient, Payment, PaymentStatus, Route, User } from '@prisma/client';

const prisma = new PrismaClient();

interface PaymentRecordData {
  routeId: string;
  passengerId: string;
  amount: number; // Amount should be determined and passed to this service
  status?: PaymentStatus;
}

export const recordPayment = async (data: PaymentRecordData): Promise<Payment> => {
  // Ensure the route and passenger exist and are linked, and the route has a price
  const route = await prisma.route.findFirst({
    where: {
      id: data.routeId,
      passengers: { some: { id: data.passengerId } } // Check if passenger is on this route
    },
  });

  if (!route) {
    throw new Error("Route not found, or passenger not associated with this route.");
  }
  if (typeof route.price !== 'number') {
    throw new Error("Route does not have a defined price.");
  }

  // In a real scenario, amount might be recalculated or validated here.
  // For now, we trust the amount passed in, or use route.price.
  // Let's use the amount from input, assuming it's calculated correctly by the caller.

  return prisma.payment.create({
    data: {
      routeId: data.routeId,
      userId: data.passengerId, // Assuming userId on Payment model is the passenger
      amount: data.amount,
      status: data.status || PaymentStatus.PENDING, // Default to PENDING if not provided
    },
  });
};

export const getPaymentsByUserId = async (userId: string): Promise<Payment[]> => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      route: { // Include some route details for context
        select: { id: true, destinationLat: true, destinationLng: true, departureTime: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getPaymentById = async (paymentId: string): Promise<Payment | null> => {
  return prisma.payment.findUnique({
    where: {id: paymentId},
    include: {
        user: {select: {id: true, name: true, email: true}},
        route: {select: {id: true, destinationLat: true, destinationLng: true}}
    }
  });
};

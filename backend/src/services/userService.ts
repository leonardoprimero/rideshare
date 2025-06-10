import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'> & { role?: any }): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: { // Explicitly select fields to avoid exposing password
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

interface UserProfileUpdateData {
  name?: string;
  // Add other updatable fields here, e.g., phoneNumber, profilePictureUrl
  // Explicitly EXCLUDE email, password, role from this interface for profile updates
}

export const updateUserProfile = async (userId: string, data: UserProfileUpdateData): Promise<User | null> => {
  // Ensure no forbidden fields are attempted to be updated through this specific function
  const { name, ...otherData } = data;
  if (Object.keys(otherData).length > 0) {
      // This check is an additional safeguard. The controller should also filter.
      console.warn(`Attempt to update restricted fields in updateUserProfile for user ${userId}: ${Object.keys(otherData).join(", ")}`);
      // Depending on strictness, could throw an error here.
  }

  const allowedDataToUpdate: UserProfileUpdateData = {};
  if (typeof name === 'string') {
    allowedDataToUpdate.name = name;
  }


  if (Object.keys(allowedDataToUpdate).length === 0) {
    // This case should ideally be caught by the controller
    // but as a safeguard in service layer:
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    return currentUser; // Return current user if no valid data to update
  }

  return prisma.user.update({
    where: { id: userId },
    data: allowedDataToUpdate,
    select: { // Return only safe fields
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

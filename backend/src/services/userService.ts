import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Explicit Interface for UserPublicProfile
export interface UserPublicProfile {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date; // Prisma types Date as Date, not string
  updatedAt: Date; // Prisma types Date as Date, not string
  // Add other non-sensitive fields from the User model if they should be public
  // e.g., phone?: string | null;
  // profilePictureUrl?: string | null;
}

// Interface for data needed to create a user.
// Password is required here for hashing. Role is also part of User model.
interface UserCreationDataInput extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'routesAsDriver' | 'routesAsPassenger' | 'payments'> {
  // This type expects 'email', 'password', 'name' (optional), 'role' (optional)
}

export const createUser = async (data: UserCreationDataInput): Promise<User> => { // Returns the full User object as it's a new creation
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || Role.PASSENGER,
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  // This function might be used for login, so returning the full User object (including password hash) is acceptable here.
  return prisma.user.findUnique({
    where: { email },
  });
};

// Updated to return UserPublicProfile
export const findUserById = async (id: string): Promise<UserPublicProfile | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // e.g. phone: true, (if 'phone' is in UserPublicProfile and User model)
    },
  });
  return user; // Prisma's select automatically shapes the return type to match UserPublicProfile
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

interface UserProfileUpdateData {
  name?: string;
  // e.g. phone?: string;
}

// Updated to return UserPublicProfile
export const updateUserProfile = async (userId: string, data: UserProfileUpdateData): Promise<UserPublicProfile | null> => {
  const allowedDataToUpdate: Partial<User> = {};
  if (typeof data.name === 'string') {
    allowedDataToUpdate.name = data.name;
  }
  // if (typeof data.phone === 'string') allowedDataToUpdate.phone = data.phone;


  if (Object.keys(allowedDataToUpdate).length === 0) {
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true
            // e.g. phone: true,
        }
    });
    return currentUser;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: allowedDataToUpdate,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // e.g. phone: true,
    },
  });
  return updatedUser;
};

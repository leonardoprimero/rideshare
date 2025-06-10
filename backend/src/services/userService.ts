import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Define UserPublicProfile type by omitting 'password' from the Prisma User type
export type UserPublicProfile = Omit<User, 'password'>;

// Interface for data needed to create a user.
interface UserCreationDataInput extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'routesAsDriver' | 'routesAsPassenger' | 'payments'> {
  // This type expects 'email', 'password', 'name' (optional), 'role' (optional)
  // Note: 'password' here is the plaintext password for hashing.
}

export const createUser = async (data: UserCreationDataInput): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword, // Storing the hashed password
      name: data.name,
      role: data.role || Role.PASSENGER, // Default role if not provided
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string): Promise<UserPublicProfile | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // Explicitly list other fields of User model if they were added and should be public
      // e.g. phone: true, if phone was added to User model and UserPublicProfile
    },
  });
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

interface UserProfileUpdateData {
  name?: string;
  // e.g. phone?: string;
}

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
    return currentUser; // This will be UserPublicProfile | null
  }

  return prisma.user.update({
    where: { id: userId },
    data: allowedDataToUpdate,
    select: { // This select now exactly matches the fields of UserPublicProfile (base User minus password)
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // e.g. phone: true,
    },
  });
};

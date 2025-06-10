import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { findUserById, updateUserProfile } from '../services/userService'; // updateUserProfile will be added to userService

export const handleGetUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // This is the same as /api/auth/me, but can live here if we expand user-specific non-auth features
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated or user ID missing in token" });
      return;
    }
    const user = await findUserById(userId); // findUserById already selects safe fields
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUpdateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated or user ID missing in token" });
      return;
    }

    const { name } = req.body; // Only allow 'name' to be updated for now. Add other fields as needed.

    if (typeof name === 'undefined') {
        res.status(400).json({ message: "No update data provided or invalid field. Only 'name' can be updated." });
        return;
    }

    // Ensure no forbidden fields are passed (e.g. email, role, password)
    const updateData: { name?: string } = {};
    if (name && typeof name === 'string') {
      updateData.name = name;
    } else if (name) {
      // if name is present but not a string
      res.status(400).json({ message: "'name' must be a string." });
      return;
    }


    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No valid fields provided for update. Only 'name' can be updated." });
      return;
    }

    const updatedUser = await updateUserProfile(userId, updateData);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found or update failed." }); // Should not happen if userId is from token
      return;
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

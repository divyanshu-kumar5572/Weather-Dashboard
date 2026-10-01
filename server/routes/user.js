import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   PUT /api/user/preferences
 * @desc    Update user preferences (e.g., temperature unit)
 * @access  Private
 */
router.put("/preferences", protect, async (req, res) => {
  const { unit } = req.body;
  if (!unit || !["metric", "imperial"].includes(unit)) {
    return res
      .status(400)
      .json({ message: "Invalid unit preference provided." });
  }
  try {
    await User.findByIdAndUpdate(req.user.id, { unitPreference: unit });
    res.status(200).json({ message: "Preferences updated successfully." });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res
      .status(500)
      .json({ message: "Server error while updating preferences." });
  }
});

export default router;

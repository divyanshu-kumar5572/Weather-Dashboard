import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   GET /api/favorites
 * @desc    Get the logged-in user's favorite cities
 * @access  Private
 */
router.get("/", protect, (req, res) => {
  res.status(200).json({
    favoriteCities: req.user.favoriteCities,
  });
});

/**
 * @route   POST /api/favorites
 * @desc    Add a city to the logged-in user's favorites
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ message: "City name is required" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // The ID of the document to update.
      {
        $addToSet: { favoriteCities: city },
      },
      {
        new: true,
      },
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `'${city}' added to favorites successfully.`,
      favoriteCities: updatedUser.favoriteCities,
    });
  } catch (error) {
    console.error("Error adding favorite city:", error);
    res.status(500).json({ message: "Server error" });
  }
});
/**
 * @route   DELETE /api/favorites
 * @desc    Remove a city from the logged-in user's favorites
 * @access  Private
 */
router.delete("/", protect, async (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ message: "City name is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { favoriteCities: city },
      },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `'${city}' removed from favorites successfully.`,
      favoriteCities: updatedUser.favoriteCities,
    });
  } catch (error) {
    console.error("Error removing favorite city:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

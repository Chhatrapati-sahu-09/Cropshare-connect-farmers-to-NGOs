import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllNGOs,
  getNGOEcosystem,
  getNearbyNGOs,
  getUserById,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Update this route to handle both GET and PUT
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get("/ngos", protect, getAllNGOs);
router.get("/ecosystem", protect, getNGOEcosystem);
router.get("/nearby-ngos", protect, getNearbyNGOs);
// Get public user profile by id
router.get("/:id", protect, getUserById);

export default router;

import express from "express";
import { protect, checkRole } from "../middleware/authMiddleware.js";
import {
  createPickup,
  getPickupsForFarmer,
  getPickupsForNGO,
  updatePickupStatus,
} from "../controllers/pickupController.js";

const router = express.Router();

// NGO creates pickup
router.post("/", protect, checkRole("ngo"), createPickup);

// Farmer views pickups
router.get("/for-farmer", protect, checkRole("farmer"), getPickupsForFarmer);

// NGO views their pickups
router.get("/for-ngo", protect, checkRole("ngo"), getPickupsForNGO);

// Farmer updates status
router.put("/:id", protect, checkRole("farmer"), updatePickupStatus);

export default router;

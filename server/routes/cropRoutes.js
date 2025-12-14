import express from "express";
import {
  addCrop,
  getCrops,
  deleteCrop,
  getMyCrops,
  getCropById,
  getCropsNearby,
} from "../controllers/cropController.js";
import { protect, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get nearby crops (MUST come BEFORE /:id route)
router.get("/nearby", getCropsNearby);

// 2. Add this new route. It MUST come before the /:id route
router.get("/mycrops", protect, getMyCrops);

router
  .route("/")
  .post(protect, checkRole("farmer"), addCrop) // Must be logged in and a 'farmer'
  .get(getCrops); // Public: Anyone can see crops

// 3. Add this route *above* your existing /:id route
router.route("/:id").get(getCropById);

// 4. Your old route for deleting
router.route("/:id").delete(protect, checkRole("farmer"), deleteCrop);

export default router;

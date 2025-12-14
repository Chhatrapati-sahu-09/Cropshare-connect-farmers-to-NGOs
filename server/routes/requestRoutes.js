import express from "express";
import {
  makeRequest,
  getReceivedRequests,
  updateRequestStatus,
  getConversations,
  getUnreadRequestCount,
  getSentRequests,
} from "../controllers/requestController.js";
import { protect, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get active chats (Messages Tab)
router.get("/conversations", protect, getConversations);

// Route to get unread request count
router.get(
  "/unread-count",
  protect,
  checkRole("farmer"),
  getUnreadRequestCount
);

// Route to get sent requests (NGO only)
router.get("/sent", protect, checkRole("ngo"), getSentRequests);

// NGO route
router.route("/").post(protect, checkRole("ngo"), makeRequest);

// Farmer route
router
  .route("/received")
  .get(protect, checkRole("farmer"), getReceivedRequests);

// Route to Accept/Reject
router.route("/:id").put(protect, checkRole("farmer"), updateRequestStatus);

export default router;

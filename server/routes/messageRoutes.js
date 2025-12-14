import express from "express";
import {
  sendMessage,
  getMessages,
  getUnreadMessageCount,
  getChatList,
  markMessagesAsRead,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get chat list (Put it BEFORE the /:otherUserId route to avoid conflicts)
router.get("/conversations", protect, getChatList);

// Route to get unread message count
router.get("/unread-count", protect, getUnreadMessageCount);

// Route to mark messages as read
router.put("/mark-read/:senderId", protect, markMessagesAsRead);

// Protect both routes. Only logged-in users can send/receive messages.
router.route("/").post(protect, sendMessage);
router.route("/:otherUserId").get(protect, getMessages);

export default router;

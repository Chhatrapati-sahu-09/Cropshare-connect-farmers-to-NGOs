import Message from "../models/Message.js";
import mongoose from "mongoose";

// @desc   Send a message
// @route  POST /api/messages
// @access Private
const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user._id; // Comes from the 'protect' middleware

  try {
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    // ✅ SOCKET.IO EMIT LOGIC
    // This sends the message to the specific receiver in real-time
    req.io.to(receiverId).emit("receive_message", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    // ✅ Add console log to see it in your terminal
    console.error("Error in sendMessage:", error);

    // ✅ Send the actual error message to the frontend
    res
      .status(400)
      .json({ message: "Invalid message data", error: error.message });
  }
};

// @desc   Get messages between two users
// @route  GET /api/messages/:otherUserId
// @access Private
const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const loggedInUserId = req.user._id;

  try {
    // Find messages where the logged-in user is sender and other is receiver OR vice versa
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
    }).sort("createdAt");

    // ✅ Mark messages sent TO the logged-in user as read
    await Message.updateMany(
      { receiverId: loggedInUserId, senderId: otherUserId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get unread message count for the logged-in user
// @route  GET /api/messages/unread-count
// @access Private
const getUnreadMessageCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      read: false, // Count messages not yet marked as read
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get list of users I have chatted with
// @route  GET /api/messages/conversations
// @access Private
const getChatList = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Use MongoDB Aggregation to group messages by conversation partner
    const chatList = await Message.aggregate([
      {
        // 1. Find all messages sent OR received by me
        $match: {
          $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        },
      },
      {
        // 2. Sort by newest first
        $sort: { createdAt: -1 },
      },
      {
        // 3. Group by the "other" person
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", currentUserId] },
              "$receiverId", // If I sent it, group by receiver
              "$senderId", // If I received it, group by sender
            ],
          },
          lastMessage: { $first: "$message" },
          timestamp: { $first: "$createdAt" },
        },
      },
      {
        // 4. Get the user details for that ID
        $lookup: {
          from: "users", // NOTE: This must match your collection name in MongoDB (usually lowercase plural)
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        // 5. Clean up the output
        $project: {
          _id: 1,
          lastMessage: 1,
          timestamp: 1,
          otherUser: {
            _id: "$userDetails._id",
            name: "$userDetails.name",
            email: "$userDetails.email",
            organizationName: "$userDetails.organizationName",
          },
        },
      },
    ]);

    res.json(chatList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc   Mark messages from a specific sender as read
// @route  PUT /api/messages/mark-read/:senderId
// @access Private
const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const receiverId = req.user._id;

    const result = await Message.updateMany(
      { senderId, receiverId, read: false },
      { $set: { read: true } }
    );

    res.json({
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  sendMessage,
  getMessages,
  getUnreadMessageCount,
  getChatList,
  markMessagesAsRead,
};

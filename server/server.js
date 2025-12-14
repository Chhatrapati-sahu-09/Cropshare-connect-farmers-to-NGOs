import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// 1. Configure Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      process.env.CLIENT_URL || "https://cropshare-client.onrender.com"
    ],
    credentials: true,
  },
});

// 2. Standard Middleware (CORS, Body Parser, Cookie Parser)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL || "https://cropshare-client.onrender.com"
];

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// 3. (CRITICAL FIX) Attach Socket.io to Request BEFORE Routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 4. Socket.io Connection Logic
io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("join_chat", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });
});

// 5. Routes (Now they can access req.io!)
app.use("/api/users", userRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/upload", uploadRoutes);

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "CropShare API is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/", (req, res) => {
  res.send("CropShare API is running...");
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// ==================
// MIDDLEWARE
// ==================
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ==================
// SOCKET.IO (SAME DOMAIN)
// ==================
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join_chat", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });
});

// ==================
// API ROUTES
// ==================
app.use("/api/users", userRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "CropShare" });
});

// ==================
// SERVE FRONTEND (CRITICAL)
// ==================
const __dirname = path.resolve();
const clientBuildPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ==================
// START SERVER (RENDER)
// ==================
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

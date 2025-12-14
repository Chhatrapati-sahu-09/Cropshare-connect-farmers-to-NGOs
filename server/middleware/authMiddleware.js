import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes (checks if user is logged in)
const protect = async (req, res, next) => {
  let token;

  // 1. Read the JWT from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token (and attach it to the req object)
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // Go to the next middleware/controller
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check for a specific role (e.g., 'admin' or 'farmer')
// This middleware must be used *after* the protect middleware
const checkRole = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ message: `Not authorized, ${role} role required` });
  }
};

export { protect, checkRole };

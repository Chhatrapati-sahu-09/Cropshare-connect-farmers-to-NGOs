import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// @desc   Register a new user (Farmer or NGO)
// @route  POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
  // ✅ Extract the new NGO fields from the request body
  const {
    name,
    email,
    password,
    role,
    location,
    organizationName,
    ngoRegNumber,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create user with new fields
    const user = await User.create({
      name,
      email,
      password,
      role, // This will now be 'farmer' or 'ngo'
      location,
      organizationName,
      ngoRegNumber,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName, // Return this to frontend
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Authenticate user & get token (Login)
// @route  POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user._id); // Sets the JWT cookie
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Don't send password
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Common fields
    user.name = req.body.name || user.name;
    user.location = req.body.location || user.location;

    // ✅ NGO Specific Updates
    if (user.role === "ngo") {
      user.organizationName =
        req.body.organizationName || user.organizationName;
      user.ngoRegNumber = req.body.ngoRegNumber || user.ngoRegNumber;
      user.missionStatement =
        req.body.missionStatement || user.missionStatement;
      user.capacity = req.body.capacity || user.capacity;

      // Handle requiredCrops (Expect array from frontend)
      if (req.body.requiredCrops) {
        user.requiredCrops = req.body.requiredCrops;
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      location: updatedUser.location,
      organizationName: updatedUser.organizationName,
      // Return other fields if needed by frontend immediately
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc   Get all registered NGOs (Public profile data)
// @route  GET /api/users/ngos
// @access Private
const getAllNGOs = async (req, res) => {
  try {
    // Find all users where role is 'ngo'
    // We select specific fields so we don't send sensitive data like passwords
    const ngos = await User.find({ role: "ngo" }).select(
      "name email location organizationName ngoRegNumber missionStatement requiredCrops"
    );

    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get NGO Ecosystem data (Connected farmers, requests, etc.)
// @route  GET /api/users/ecosystem
// @access Private (NGO only)
const getNGOEcosystem = async (req, res) => {
  try {
    const ngoId = req.user._id;

    // Import here to avoid circular dependency
    const Request = (await import("../models/Request.js")).default;
    const Crop = (await import("../models/Crop.js")).default;

    // Get all requests sent by this NGO (to get connected farmers)
    const requests = await Request.find({ buyerId: ngoId, status: "accepted" })
      .populate("farmerId", "name location email _id")
      .populate({
        path: "cropId",
        select: "title quantity createdAt",
        populate: { path: "farmerId", select: "_id" },
      })
      .sort({ updatedAt: -1 });

    // Get unique farmers from accepted requests
    const farmerMap = new Map();
    requests.forEach((req) => {
      if (req.farmerId && !farmerMap.has(req.farmerId._id.toString())) {
        farmerMap.set(req.farmerId._id.toString(), req.farmerId);
      }
    });

    const connectedFarmers = Array.from(farmerMap.values());

    // Get total crops from each farmer
    const farmers = await Promise.all(
      connectedFarmers.map(async (farmer) => {
        const crops = await Crop.find({ farmerId: farmer._id });
        const activeCrops = crops.filter((c) => c.status === "approved");
        const totalDonated = crops.length;

        // Get last interaction (most recent request)
        const lastRequest = await Request.findOne({
          farmerId: farmer._id,
          buyerId: ngoId,
        })
          .sort({ updatedAt: -1 })
          .select("updatedAt");

        return {
          _id: farmer._id,
          name: farmer.name,
          village: farmer.location || "Not specified",
          totalCropsDonated: totalDonated,
          activeListing: activeCrops.length,
          lastInteraction: lastRequest?.updatedAt || "No interaction",
          email: farmer.email,
        };
      })
    );

    // Get all accepted requests count
    const totalAcceptedRequests = await Request.countDocuments({
      buyerId: ngoId,
      status: "accepted",
    });

    res.json({
      connectedFarmers: farmers,
      totalAcceptedRequests,
      totalConnectedFarmers: farmers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get nearby NGOs for collaboration
// @route  GET /api/users/nearby-ngos
// @access Private
const getNearbyNGOs = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query;
    const currentNGOId = req.user._id;

    // Simple distance calculation (can be improved with MongoDB geospatial queries)
    // For now, return all other NGOs
    const nearbyNGOs = await User.find({
      role: "ngo",
      _id: { $ne: currentNGOId },
    }).select(
      "name email location organizationName missionStatement requiredCrops"
    );

    res.json(nearbyNGOs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get public user profile by id
// @route  GET /api/users/:id
// @access Private (any logged in user)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email role location organizationName");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllNGOs,
  getNGOEcosystem,
  getNearbyNGOs,
  getUserById,
};

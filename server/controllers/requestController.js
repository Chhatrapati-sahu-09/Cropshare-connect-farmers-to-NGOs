import Request from "../models/Request.js";
import Crop from "../models/Crop.js";

// @desc   Make a new request for a crop
// @route  POST /api/requests
// @access Private (Buyer only)
export const makeRequest = async (req, res) => {
  const { cropId } = req.body;
  const buyerId = req.user._id;

  try {
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    // Check if a request already exists
    const existingRequest = await Request.findOne({ cropId, buyerId });
    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const newRequest = await Request.create({
      cropId,
      buyerId,
      farmerId: crop.farmerId,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all requests received by the logged-in farmer
// @route  GET /api/requests/received
// @access Private (Farmer only)
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ farmerId: req.user._id })
      .populate("cropId", "title price") // Get crop details
      .populate("buyerId", "name email"); // Get buyer details

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update request status (Accept/Reject)
// @route  PUT /api/requests/:id
// @access Private (Farmer only)
export const updateRequestStatus = async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'

  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify the farmer owns this request
    if (request.farmerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all active conversations (Accepted requests)
// @route  GET /api/requests/conversations
// @access Private (Both Buyer & Farmer)
export const getConversations = async (req, res) => {
  try {
    // Find requests where status is 'accepted' AND user is involved
    const conversations = await Request.find({
      status: "accepted",
      $or: [{ farmerId: req.user._id }, { buyerId: req.user._id }],
    })
      .populate("cropId", "title")
      .populate("farmerId", "name email")
      .populate("buyerId", "name email");

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all requests sent BY the logged-in buyer
// @route  GET /api/requests/sent
// @access Private (Buyer only)
export const getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyerId: req.user._id })
      .populate("cropId", "title price") // Show crop info
      .populate("farmerId", "name email location") // Show farmer info
      .sort({ createdAt: -1 }); // Newest first

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get unread request count for a farmer
// @route  GET /api/requests/unread-count
// @access Private (Farmer only)
export const getUnreadRequestCount = async (req, res) => {
  try {
    const count = await Request.countDocuments({
      farmerId: req.user._id,
      status: "pending", // Only count pending requests
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

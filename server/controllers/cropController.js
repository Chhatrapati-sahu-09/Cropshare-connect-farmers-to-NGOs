import Crop from "../models/Crop.js";

// @desc   Add a new crop
// @route  POST /api/crops
// @access Private (Farmer only)
const addCrop = async (req, res) => {
  // ✅ UPDATE: Extract 'location' from the request body
  const { title, price, quantity, description, category, image, location } =
    req.body;

  // req.user is added by the 'protect' middleware
  const farmerId = req.user._id;

  try {
    const crop = await Crop.create({
      farmerId,
      title,
      price,
      quantity,
      description,
      category,
      image,
      location, // ✅ UPDATE: Save the location to the database
    });
    res.status(201).json(crop);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid crop data", error: error.message });
  }
};

// @desc   Get all (approved) crops
// @route  GET /api/crops
// @access Public
const getCrops = async (req, res) => {
  try {
    const filter = { status: "approved" };
    const { category, maxPrice, searchTerm } = req.query;

    // ✅ UPDATED LOGIC HERE
    // Only add the category to the filter if it's NOT 'all' and NOT empty
    if (category && category !== "all" && category !== "") {
      filter.category = category;
    }

    if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }

    if (searchTerm) {
      const searchRegex = { $regex: searchTerm, $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { "location.address": searchRegex },
      ];
    }

    const crops = await Crop.find(filter).populate("farmerId", "name location");
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a crop
// @route  DELETE /api/crops/:id
// @access Private (Farmer only)
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    await crop.deleteOne(); // Mongoose v6+
    res.json({ message: "Crop removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all crops for the logged-in farmer
// @route  GET /api/crops/mycrops
// @access Private (Farmer only)
const getMyCrops = async (req, res) => {
  try {
    // req.user._id comes from the 'protect' middleware
    const crops = await Crop.find({ farmerId: req.user._id });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get a single crop by its ID
// @route  GET /api/crops/:id
// @access Public (anyone can view details)
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate(
      "farmerId",
      "name location" // Also get the farmer's name and location
    );

    if (crop) {
      // We only show approved crops to the public
      if (crop.status === "approved") {
        res.json(crop);
      } else {
        res.status(403).json({ message: "This crop is not yet approved" });
      }
    } else {
      res.status(404).json({ message: "Crop not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get crops within a specific radius (km)
// @route  GET /api/crops/nearby?lat=21.14&lng=79.08&dist=50
// @access Public
const getCropsNearby = async (req, res) => {
  const { lat, lng, dist } = req.query;

  // Default distance to 50km if not specified
  const distanceInMeters = (dist || 50) * 1000;

  try {
    const crops = await Crop.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // Mongo uses [Lng, Lat]
          },
          $maxDistance: distanceInMeters,
        },
      },
      status: "approved", // Only show approved crops
    }).populate("farmerId", "name");

    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addCrop,
  getCrops,
  deleteCrop,
  getMyCrops,
  getCropById,
  getCropsNearby,
};

import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // This links it to the User model
    },
    title: {
      type: String,
      required: [true, "Please provide a crop title"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    quantity: {
      type: String, // e.g., "100kg", "50 Quintals"
      required: [true, "Please provide a quantity"],
    },
    // Adding extra fields from your original plan for a better app
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    category: {
      type: String,
      enum: ["Grains", "Vegetables", "Fruits", "Seeds", "Equipment"],
      required: [true, "Please select a category"],
    },
    image: {
      type: String, // URL to the image (e.g., from Cloudinary)
      default: "default-crop-image.jpg",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Auto-approved
    },
    // ✅ GeoJSON Location with coordinates
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        index: "2dsphere", // CRITICAL: Create a geospatial index
        default: [0, 0],
      },
      address: { type: String }, // Friendly name like "Nagpur, India"
    },
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;

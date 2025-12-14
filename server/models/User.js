import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String },

    // ✅ 1. UPDATED ROLE: Removed 'buyer', added 'ngo'
    role: {
      type: String,
      enum: ["farmer", "ngo"],
      default: "ngo",
    },

    // ✅ 2. NEW NGO FIELDS
    organizationName: { type: String }, // e.g. "Save Food Foundation"
    ngoRegNumber: { type: String }, // e.g. "NGO-12345"
    missionStatement: { type: String }, // e.g. "We feed 500 kids daily"
    capacity: { type: String }, // e.g. "Can pickup 500kg"
    requiredCrops: [{ type: String }], // e.g. ["Rice", "Wheat"]

    // Favorites list (optional, kept for future use)
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crop" }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;

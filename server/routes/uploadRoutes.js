import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Multer (Store file in memory temporarily)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Helper: Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// 3. The Upload Route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary using a stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cropshare", // Folder name in Cloudinary
      },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }
        // Success! Send back the URL
        res.json({
          message: "Image uploaded",
          imageUrl: result.secure_url,
        });
      }
    );

    // Pipe the file buffer to Cloudinary
    uploadStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const privacyType = req.body.privacyType;

    return {
      folder: `fileshare/${privacyType}`,
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      resource_type: "auto",
    };
  },
});

export const upload = multer({ storage });

export const deleteFile = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;

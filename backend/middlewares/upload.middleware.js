import cloudinary from "../config/cloudinary.config.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profileImage",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profileImage",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export const profileStorage = multer({ storage: userStorage });
export const productPicStorage = multer({ storage: productStorage });

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { UploadApiResponse } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
const uploadOnCloudinary = async (
  localFilePath: string,
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); // Remove the local file after upload
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Ensure the file is deleted on error
    return null;
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (
  fileUrl: string,
): Promise<boolean | null> => {
  try {
    console.log(fileUrl);
    // Implement deletion logic here
    return true; // Return true if successful
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

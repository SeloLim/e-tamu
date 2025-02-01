import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(imageBuffer: Buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "qrcodes" }, // Optional: specify folder
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      }
    );
    uploadStream.end(imageBuffer);
  });
}

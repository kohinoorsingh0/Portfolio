import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

const ensureCloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

/**
 * Upload buffer to Cloudinary using streaming upload
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  options: {
    folder: string;
    resource_type?: "image" | "raw" | "auto" | "video";
    public_id?: string;
  }
): Promise<CloudinaryUploadResult> => {
  ensureCloudinaryConfig();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resource_type || "auto",
        public_id: options.public_id,
        use_filename: true,
        unique_filename: true,
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export { cloudinary };
export default cloudinary;

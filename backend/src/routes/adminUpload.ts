import { Router, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../middleware/auth";
import { uploadBufferToCloudinary } from "../utils/cloudinary";

const router = Router();

// Rate limiter for upload endpoints (50 uploads / 15 minutes)
const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ error: "Upload rate limit exceeded. Please try again later." });
  },
});

router.use(uploadRateLimiter);
router.use(requireAdmin);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

// Configure multer with memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const ext = (file.originalname.split(".").pop() || "").toLowerCase();
  const isExtAllowed = ["jpg", "jpeg", "png", "webp", "pdf"].includes(ext);

  if (isMimeAllowed && isExtAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed formats: JPG, PNG, WEBP for images, and PDF for documents."
      )
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

/**
 * POST /api/admin/upload
 * Handles image (jpg/png/webp) and resume (pdf) uploads to Cloudinary
 */
router.post(
  "/upload",
  (req: Request, res: Response, next) => {
    upload.single("file")(req, res, (err: unknown) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File size exceeds 5MB limit" });
          }
          return res.status(400).json({ error: err.message });
        }
        return res.status(400).json({ error: (err as Error).message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided for upload" });
      }

      const { mimetype, buffer, originalname } = req.file;
      const isPdf = mimetype === "application/pdf";

      // Folder and resource type selection
      const folder = isPdf ? "portfolio/resume" : "portfolio/projects";
      const resourceType = isPdf ? "raw" : "image";

      const result = await uploadBufferToCloudinary(buffer, {
        folder,
        resource_type: resourceType,
      });

      return res.status(200).json({
        ok: true,
        url: result.url,
        publicId: result.publicId,
        originalname,
        mimetype,
        bytes: req.file.size,
      });
    } catch (error: unknown) {
      console.error("Cloudinary upload error:", (error as Error).message);
      return res.status(500).json({
        error: "Failed to upload file to Cloudinary. Please try again.",
      });
    }
  }
);

export default router;

import { Router, Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import SiteSettings from "../models/SiteSettings";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// Apply requireAdmin to all admin settings endpoints
router.use(requireAdmin);

const urlOrEmpty = z
  .string()
  .trim()
  .refine(
    (val) => !val || /^https?:\/\/.+/i.test(val),
    "Must be a valid URL starting with http:// or https://"
  );

// Zod schema for validating site settings updates
const updateSettingsSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  tagline: z.string().trim().default(""),
  bio: z.string().trim().default(""),
  location: z.string().trim().default(""),
  availability: z.string().trim().default(""),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  phone: z.string().trim().default(""),
  whatsapp: z.string().trim().default(""),
  github: urlOrEmpty.default(""),
  linkedin: urlOrEmpty.default(""),
  heroTitle: z.string().trim().default(""),
  heroHighlightWord: z.string().trim().default(""),
  profilePhotoUrl: z.string().trim().default(""),
  resumeUrl: z.string().trim().optional(),
});

// Verified default settings if DB is currently empty
const DEFAULT_SETTINGS = {
  name: "Kohinoor Singh",
  role: "Full-Stack Developer",
  tagline: "I build fast, beautiful web products.",
  bio: "Full-stack developer building deliberate web products, accessible interfaces, and robust systems.",
  location: "Karnal, India",
  availability: "Internships & Junior roles",
  email: process.env.CONTACT_EMAIL || "kohinoorsingh040@gmail.com",
  phone: "9350666578",
  whatsapp: "https://wa.me/919350666578",
  github: "https://github.com/kohinoorsingh0",
  linkedin: "https://www.linkedin.com/in/kohinoor-singh-5137b9413/",
  heroTitle: "I build fast, beautiful web products.",
  heroHighlightWord: "beautiful",
  profilePhotoUrl: "/images/kohinoor-watercolor.jpg",
  resumeUrl: "/resume/kohinoor-singh-resume.pdf",
};

/**
 * GET /api/admin/settings
 * Retrieves the single SiteSettings document (auth required)
 */
router.get("/settings", async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    const settings = await SiteSettings.findOne().select("-__v -_id").lean();
    if (settings) {
      return res.status(200).json(settings);
    }
    return res.status(200).json(DEFAULT_SETTINGS);
  } catch (error: unknown) {
    console.error("GET /api/admin/settings error:", (error as Error).message);
    return res.status(200).json(DEFAULT_SETTINGS);
  }
});

/**
 * PUT /api/admin/settings
 * Updates the single SiteSettings document (auth required, Zod validated)
 */
router.put("/settings", async (req: Request, res: Response) => {
  try {
    const parseResult = updateSettingsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const updated = await SiteSettings.findOneAndUpdate(
      {},
      { $set: parseResult.data },
      { new: true, upsert: true, runValidators: true }
    )
      .select("-__v -_id")
      .lean();

    return res.status(200).json({ ok: true, settings: updated });
  } catch (error: unknown) {
    console.error("PUT /api/admin/settings error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to update site settings" });
  }
});

export default router;

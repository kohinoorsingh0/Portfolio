import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "../config/db";
import ContactMessage from "../models/ContactMessage";
import SiteSettings from "../models/SiteSettings";
import { sendContactNotification } from "../utils/mail";
import { contactRateLimiter } from "../middleware/rateLimit";

const router = Router();

let lastConnectAttempt = 0;

// Helper to connect to MongoDB with a short timeout and cooldown
const connectWithTimeout = async (ms = 1500): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  const now = Date.now();
  if (now - lastConnectAttempt < 30000) {
    throw new Error("Database connection on retry cooldown");
  }
  lastConnectAttempt = now;

  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("Database connection timed out")),
      ms
    );
  });
  try {
    await Promise.race([connectDB(), timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
};

// Zod schema for Contact form submission
const contactPostSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address"),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message cannot exceed 5000 characters"),
  _gotcha: z.string().optional().default(""),
  honeypot: z.string().optional().default(""),
  website: z.string().optional().default(""),
});

// In-memory message store as fallback when database is on cooldown/unreachable in local dev
export const inMemoryMessages: Array<{
  id: string;
  name: string;
  email: string;
  message: string;
  ipHash: string | null;
  createdAt: Date;
}> = [];

/**
 * POST /api/contact
 * - Validates input with Zod
 * - Rejects honeypot spam with 400
 * - Rate-limited to 5 requests / hour / IP
 * - Saves to ContactMessage in DB FIRST
 * - Tries Nodemailer notification via sendContactNotification
 * - Never exposes SMTP errors to the client
 */
router.post(
  "/contact",
  contactRateLimiter,
  async (req: Request, res: Response) => {
    const parseResult = contactPostSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { name, email, message, _gotcha, honeypot, website } =
      parseResult.data;

    // Honeypot check: any non-empty bot field results in 400 spam rejection
    if (
      (_gotcha && _gotcha.trim().length > 0) ||
      (honeypot && honeypot.trim().length > 0) ||
      (website && website.trim().length > 0)
    ) {
      return res.status(400).json({
        error: "Spam detected",
        message: "Spam submission rejected.",
      });
    }

    const ip = (req.ip || req.socket.remoteAddress || "").toString();
    const ipHash = ip
      ? crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16)
      : null;

    let savedId: string | null = null;

    // 1. Save to ContactMessage in DB FIRST
    try {
      await connectWithTimeout();
      const savedDoc = await ContactMessage.create({
        name,
        email,
        message,
        ipHash,
      });
      savedId = savedDoc._id.toString();
    } catch (dbErr) {
      console.warn(
        "[contact] DB save error; recording in memory fallback:",
        (dbErr as Error).message
      );
      savedId = new mongoose.Types.ObjectId().toString();
      inMemoryMessages.push({
        id: savedId,
        name,
        email,
        message,
        ipHash,
        createdAt: new Date(),
      });
    }

    // 2. Try Nodemailer notification (secondary — failures never affect the client response)
    try {
      await sendContactNotification({
        name,
        email,
        message,
        ip,
      });
    } catch (mailErr) {
      // Never expose SMTP errors to the client
      console.error("[contact] Mail notification error:", mailErr);
    }

    return res.status(200).json({
      success: true,
      message: "Message received successfully. Thank you for reaching out!",
      id: savedId,
    });
  }
);

/**
 * GET /api/resume
 * - Serves the PDF uploaded via Admin (Step 31)
 * - Uses Cloudinary/external URL from SiteSettings if set
 * - Or serves local PDF from public/resume/
 * - Else returns 404 with a clear message
 */
router.get("/resume", async (_req: Request, res: Response) => {
  res.setHeader("Cache-Control", "public, max-age=60");

  try {
    await connectWithTimeout();
    const settings = await SiteSettings.findOne().lean();
    if (settings?.resumeUrl && settings.resumeUrl.trim().length > 0) {
      const resumeUrl = settings.resumeUrl.trim();
      if (
        resumeUrl.startsWith("http://") ||
        resumeUrl.startsWith("https://")
      ) {
        return res.redirect(resumeUrl);
      }
      const localPath = path.resolve(
        process.cwd(),
        resumeUrl.replace(/^\//, "")
      );
      if (fs.existsSync(localPath)) {
        res.setHeader("Content-Type", "application/pdf");
        return res.sendFile(localPath);
      }
    }
  } catch (err) {
    // If DB is unreachable or unseeded, fall through to check local filesystem
  }

  const possiblePaths = [
    path.resolve(process.cwd(), "public/resume/kohinoor-singh-resume.pdf"),
    path.resolve(process.cwd(), "backend/public/resume/kohinoor-singh-resume.pdf"),
    path.resolve(__dirname, "../../public/resume/kohinoor-singh-resume.pdf"),
    path.resolve(__dirname, "../../../public/resume/kohinoor-singh-resume.pdf"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/pdf");
      return res.sendFile(p);
    }
  }

  return res.status(404).json({
    error: "Resume not found",
    message: "No resume has been uploaded yet. Please contact me directly.",
  });
});

export default router;

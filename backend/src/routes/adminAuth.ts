import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import Admin from "../models/Admin";
import { loginRateLimiter } from "../middleware/rateLimit";
import {
  signToken,
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
} from "../utils/jwt";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// Zod validation schema for admin login
const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

/**
 * POST /api/admin/login
 * Rate-limited to 5 attempts per 15 minutes per IP
 * Constant-time bcrypt comparison
 * Sets httpOnly admin_token JWT cookie on success
 * Returns { ok: true } only — never returns hash or token in JSON
 */
router.post("/login", loginRateLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    const { email, password } = parseResult.data;

    // Connect to MongoDB if not currently ready
    if (mongoose.connection.readyState !== 1) {
      try {
        await connectDB();
      } catch (dbErr) {
        console.error("DB connection error in admin login:", (dbErr as Error).message);
        return res.status(500).json({ error: "Database connection failed" });
      }
    }

    // Look up single admin; explicitly select passwordHash
    const admin = await Admin.findOne({ email }).select("+passwordHash");

    // Constant-time compare against dummy hash if admin is not found to prevent timing attacks
    const dummyHash =
      "$2a$12$e80y6yXv/k5P8N1yYy1J.uN4P2Jb0F6h9D9N1yYy1J.uN4P2Jb0F6";
    const hashToCompare = admin?.passwordHash || dummyHash;
    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!admin || !isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Sign 7-day HS256 JWT
    const token = signToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });

    // Set secure httpOnly cookie (SameSite=none in prod for cross-site Vercel, lax in dev)
    const cookieOptions = getAdminCookieOptions();
    res.cookie(ADMIN_COOKIE_NAME, token, cookieOptions);

    // Return { ok: true } ONLY — never leak token or hash
    return res.status(200).json({ ok: true });
  } catch (error: unknown) {
    console.error("Admin login error:", (error as Error).message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/admin/logout
 * Clears the httpOnly admin_token cookie
 */
router.post("/logout", (_req: Request, res: Response) => {
  const cookieOptions = getAdminCookieOptions();
  res.clearCookie(ADMIN_COOKIE_NAME, {
    ...cookieOptions,
    maxAge: 0,
  });
  return res.status(200).json({ ok: true });
});

/**
 * GET /api/admin/me
 * Returns { email } only if valid JWT cookie is present, else 401
 */
router.get("/me", requireAdmin, (req: Request, res: Response) => {
  if (!req.admin?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.status(200).json({ email: req.admin.email });
});

export default router;

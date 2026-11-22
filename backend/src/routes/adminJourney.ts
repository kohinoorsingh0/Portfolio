import { Router, Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import { connectDB } from "../config/db";
import Journey, { journeyTypes } from "../models/Journey";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// 1. Rate limiter for admin journey endpoints (300 requests / 15 minutes)
const adminJourneyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ error: "Too many admin requests. Please slow down." });
  },
});

router.use(adminJourneyLimiter);

// 2. Enforce admin authentication on all routes
router.use(requireAdmin);

// Zod schema for Journey Create / Update
export const journeyInputSchema = z.object({
  type: z.enum(journeyTypes, {
    errorMap: () => ({
      message: "Type must be Experience, Education, or Certificate",
    }),
  }),
  yearLabel: z.string().trim().default(""),
  title: z.string().trim().min(1, "Title is required"),
  organisation: z.string().trim().min(1, "Organisation is required"),
  description: z.string().trim().default(""),
  order: z.number().int("Order must be an integer").default(0),
  visible: z.boolean().default(true),
});

// Real verified journey fallback data in case DB is not yet populated
const FALLBACK_JOURNEY = [
  {
    type: "Experience",
    yearLabel: "2026",
    title: "Full-Stack Developer",
    organisation: "FixFlow · Campus Complaint System (College Project)",
    description:
      "Architected and built an end-to-end campus complaint workflow system (37,612 lines of code, 183 files, 43 tests). Built 3 roles (student, staff, admin), OTP email verification, SLA tracking, AI triage with duplicate detection, campus heatmap, and PWA capabilities.",
    order: 1,
    visible: true,
  },
  {
    type: "Certificate",
    yearLabel: "2026",
    title: "Full Stack Development with AI",
    organisation: "PW Skills",
    description:
      "Completed comprehensive certification on 27 September 2026. Covered full-stack architecture, React, Node.js, Express, MongoDB, REST APIs, and generative AI system integration.",
    order: 2,
    visible: true,
  },
  {
    type: "Education",
    yearLabel: "",
    title: "Bachelor of Computer Applications (B.C.A.)",
    organisation: "Pt. Chiranji Lal Sharma Govt. P.G. College, Karnal",
    description:
      "B.C.A. Web Development. Specializing in computer science fundamentals, data structures, algorithms, web technologies, and database management systems. Currently pursuing.",
    order: 3,
    visible: true,
  },
];

/**
 * GET /api/admin/journey
 * Returns all journey entries sorted by order ascending, then createdAt descending
 */
router.get("/journey", async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    let items = await Journey.find().sort({ order: 1, createdAt: -1 }).select("-__v").lean();

    // Auto-seed if collection is currently empty
    if (!items || items.length === 0) {
      try {
        await Journey.insertMany(FALLBACK_JOURNEY);
        items = await Journey.find().sort({ order: 1, createdAt: -1 }).select("-__v").lean();
      } catch (seedErr) {
        console.error("Auto-seed journey error:", (seedErr as Error).message);
        return res.status(200).json({
          ok: true,
          journey: FALLBACK_JOURNEY,
        });
      }
    }

    return res.status(200).json({
      ok: true,
      journey: items,
    });
  } catch (error: unknown) {
    console.error("GET /api/admin/journey error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to fetch journey items" });
  }
});

/**
 * POST /api/admin/journey
 * Creates a new journey entry with Zod validation
 */
router.post("/journey", async (req: Request, res: Response) => {
  try {
    const parseResult = journeyInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const created = await Journey.create(parseResult.data);

    return res.status(201).json({
      ok: true,
      journey: created,
    });
  } catch (error: unknown) {
    console.error("POST /api/admin/journey error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to create journey entry" });
  }
});

/**
 * GET /api/admin/journey/:id
 * Retrieves a single journey entry by ID
 */
router.get("/journey/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid journey ID format" });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const item = await Journey.findById(id).select("-__v").lean();
    if (!item) {
      return res.status(404).json({ error: "Journey entry not found" });
    }

    return res.status(200).json({
      ok: true,
      journey: item,
    });
  } catch (error: unknown) {
    console.error("GET /api/admin/journey/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to fetch journey entry" });
  }
});

/**
 * PUT /api/admin/journey/:id
 * Updates an existing journey entry with Zod validation
 */
router.put("/journey/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid journey ID format" });
    }

    const parseResult = journeyInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const updated = await Journey.findByIdAndUpdate(
      id,
      { $set: parseResult.data },
      { new: true, runValidators: true }
    )
      .select("-__v")
      .lean();

    if (!updated) {
      return res.status(404).json({ error: "Journey entry not found" });
    }

    return res.status(200).json({
      ok: true,
      journey: updated,
    });
  } catch (error: unknown) {
    console.error("PUT /api/admin/journey/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to update journey entry" });
  }
});

/**
 * DELETE /api/admin/journey/:id
 * Deletes a journey entry by ID
 */
router.delete("/journey/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid journey ID format" });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const deleted = await Journey.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Journey entry not found" });
    }

    return res.status(200).json({
      ok: true,
      message: "Journey entry deleted successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/admin/journey/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to delete journey entry" });
  }
});

export default router;

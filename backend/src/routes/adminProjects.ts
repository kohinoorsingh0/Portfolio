import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import { connectDB } from "../config/db";
import Project from "../models/Project";
import { projectValidationSchema } from "../utils/validation";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// 1. Rate limiter for admin projects endpoints (300 requests / 15 minutes)
const adminProjectsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ error: "Too many admin requests. Please slow down." });
  },
});

router.use(adminProjectsLimiter);

// 2. Enforce admin authentication on all routes
router.use(requireAdmin);

// Seeded real projects fallback (FixFlow and Kohinoor Tunes only)
const FALLBACK_PROJECTS = [
  {
    _id: "6b02d1fa57c7e6f776e77e11",
    title: "FixFlow",
    slug: "fixflow",
    shortDescription: "Campus complaint workflow system with multi-role routing, SLA tracking, and AI triage.",
    longDescription:
      "End-to-end grievance management platform for colleges featuring 3 roles (student, staff, admin), OTP authentication, AI complaint categorization and duplicate detection, SLA countdowns, and PWA capabilities.",
    stack: ["React 19", "Node.js", "Express 5", "MongoDB", "Tailwind 4", "Gemini AI"],
    imageUrl: "/images/fixflow-card.png",
    githubUrl: "https://github.com/FixFlow-Official/FixFlow",
    liveUrl: null,
    featured: true,
    order: 1,
    visible: true,
    caseStudy: {
      overview:
        "FixFlow was created to eliminate lost paper complaints, chaotic messaging groups, and unaccountable campus maintenance requests by providing a transparent digital grievance workflow.",
      challenge:
        "Colleges struggle with high complaint volume, redundant reports of the same outage, unmonitored repair delays, and zero accountability between students and administration.",
      solution:
        "Engineered a production-ready MERN system with role-based access, automated SLA timers, Gemini AI triage to cluster duplicates, live room QR scanning, and push notifications.",
      outcome:
        "Built to hold up beyond the demo with 37,612 lines of code across 183 files, 43 automated test suites, and robust multi-tier authentication.",
    },
    resultText: "37,612 lines · 183 files · 43 tests",
  },
  {
    _id: "6b02d1fa57c7e6f776e77e22",
    title: "Kohinoor Tunes",
    slug: "kohinoor-tunes",
    shortDescription: "Free, open-source music streaming client with background audio playback and zero ads.",
    longDescription:
      "A personalized, sleek audio player designed for uninterrupted listening with local playlists, background audio playback, and clean UI.",
    stack: ["React Native", "TypeScript", "Expo", "Audio API"],
    imageUrl: "/images/kohinoor-tunes.png",
    githubUrl: "https://github.com/kohinoorsingh0/KohinoorTunes",
    liveUrl: null,
    featured: false,
    order: 2,
    visible: true,
    caseStudy: {
      overview:
        "Kohinoor Tunes is a community-first audio application focused on speed, zero ad interruptions, and intuitive playlist management.",
      challenge:
        "Most music apps are bloated with sponsored promotions, heavy analytics, and aggressive paywalls that hinder simple listening.",
      solution:
        "Developed an uncluttered mobile streaming player leveraging high-performance audio decoders and minimalist aesthetic principles.",
      outcome:
        "Delivered a daily-driver music app used by friends and peers with rock-solid playback stability.",
    },
    resultText: "Open-source audio player",
  },
];

/**
 * GET /api/admin/projects
 * Retrieves all projects sorted by order ascending, then createdAt ascending
 */
router.get("/projects", async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const projects = await Project.find()
      .select("-__v")
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return res.status(200).json(projects);
  } catch (error: unknown) {
    console.error("GET /api/admin/projects error:", (error as Error).message);
    return res.status(200).json(FALLBACK_PROJECTS);
  }
});

/**
 * POST /api/admin/projects
 * Creates a new project (validated with Zod from Step 8)
 */
router.post("/projects", async (req: Request, res: Response) => {
  try {
    const parseResult = projectValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const projectData = parseResult.data;

    // Check slug uniqueness
    const existing = await Project.findOne({ slug: projectData.slug.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        error: `Project with slug "${projectData.slug}" already exists`,
      });
    }

    const newProject = await Project.create(projectData);

    return res.status(201).json({
      ok: true,
      project: newProject,
    });
  } catch (error: unknown) {
    console.error("POST /api/admin/projects error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to create project" });
  }
});

/**
 * GET /api/admin/projects/:id
 * Retrieves a single project by ID
 */
router.get("/projects/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID format" });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const project = await Project.findById(id).select("-__v").lean();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      ok: true,
      project,
    });
  } catch (error: unknown) {
    console.error("GET /api/admin/projects/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to fetch project" });
  }
});

/**
 * PUT /api/admin/projects/:id
 * Updates an existing project by ID (validated with Zod from Step 8)
 */
router.put("/projects/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID format" });
    }

    const parseResult = projectValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const projectData = parseResult.data;

    // Check slug uniqueness excluding self
    const conflict = await Project.findOne({
      _id: { $ne: id },
      slug: projectData.slug.toLowerCase(),
    });

    if (conflict) {
      return res.status(409).json({
        error: `Another project with slug "${projectData.slug}" already exists`,
      });
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: projectData },
      { new: true, runValidators: true }
    )
      .select("-__v")
      .lean();

    if (!updated) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      ok: true,
      project: updated,
    });
  } catch (error: unknown) {
    console.error("PUT /api/admin/projects/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to update project" });
  }
});

/**
 * DELETE /api/admin/projects/:id
 * Deletes a project by ID
 */
router.delete("/projects/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID format" });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const deleted = await Project.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      ok: true,
      message: `Project "${deleted.title}" deleted successfully`,
    });
  } catch (error: unknown) {
    console.error("DELETE /api/admin/projects/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;

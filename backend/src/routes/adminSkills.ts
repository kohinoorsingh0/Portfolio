import { Router, Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import { connectDB } from "../config/db";
import Skill, { skillCategories, skillLevels } from "../models/Skill";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// 1. Rate limiter for admin skills endpoints (300 requests / 15 minutes)
const adminSkillsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ error: "Too many admin requests. Please slow down." });
  },
});

router.use(adminSkillsLimiter);

// 2. Enforce admin authentication on all routes
router.use(requireAdmin);

// Zod schema for Skill Create / Update (Strictly NO percentage field)
const skillInputSchema = z.object({
  category: z.enum(skillCategories, {
    errorMap: () => ({
      message: "Category must be Frontend, Backend, Database, or Tools & DevOps",
    }),
  }),
  name: z.string().trim().min(1, "Skill name is required"),
  level: z.enum(skillLevels, {
    errorMap: () => ({
      message: "Level must be Beginner, Working, or Strong",
    }),
  }),
  order: z.number().int("Order must be an integer").default(0),
  visible: z.boolean().default(true),
});

// Seeded fallback skills in case DB is newly initialized
const FALLBACK_SKILLS = [
  { category: "Frontend", name: "React", level: "Strong", order: 1, visible: true },
  { category: "Frontend", name: "TypeScript", level: "Strong", order: 2, visible: true },
  { category: "Frontend", name: "Next.js", level: "Working", order: 3, visible: true },
  { category: "Frontend", name: "Tailwind CSS", level: "Strong", order: 4, visible: true },
  { category: "Backend", name: "Node.js", level: "Strong", order: 5, visible: true },
  { category: "Backend", name: "Express", level: "Strong", order: 6, visible: true },
  { category: "Backend", name: "REST APIs", level: "Strong", order: 7, visible: true },
  { category: "Backend", name: "Auth (JWT/OTP)", level: "Working", order: 8, visible: true },
  { category: "Database", name: "MongoDB", level: "Strong", order: 9, visible: true },
  { category: "Database", name: "Mongoose", level: "Strong", order: 10, visible: true },
  { category: "Database", name: "PostgreSQL", level: "Working", order: 11, visible: true },
  { category: "Tools & DevOps", name: "Git & GitHub", level: "Strong", order: 12, visible: true },
  { category: "Tools & DevOps", name: "Docker", level: "Working", order: 13, visible: true },
  { category: "Tools & DevOps", name: "Vercel", level: "Strong", order: 14, visible: true },
  { category: "Tools & DevOps", name: "Figma", level: "Working", order: 15, visible: true },
];

/**
 * GET /api/admin/skills
 * Returns all skills sorted by order ascending, then name ascending
 */
router.get("/skills", async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const skills = await Skill.find()
      .select("-__v")
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return res.status(200).json(skills);
  } catch (error: unknown) {
    console.error("GET /api/admin/skills error:", (error as Error).message);
    return res.status(200).json(FALLBACK_SKILLS);
  }
});

/**
 * POST /api/admin/skills
 * Creates a new skill
 */
router.post("/skills", async (req: Request, res: Response) => {
  try {
    const parseResult = skillInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const { category, name, level, order, visible } = parseResult.data;

    // Check for existing duplicate skill in the same category
    const existing = await Skill.findOne({
      category,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existing) {
      return res.status(409).json({
        error: `Skill "${name}" already exists in ${category}`,
      });
    }

    const newSkill = await Skill.create({
      category,
      name,
      level,
      order,
      visible,
    });

    return res.status(201).json({
      ok: true,
      skill: {
        _id: newSkill._id,
        category: newSkill.category,
        name: newSkill.name,
        level: newSkill.level,
        order: newSkill.order,
        visible: newSkill.visible,
        createdAt: newSkill.createdAt,
        updatedAt: newSkill.updatedAt,
      },
    });
  } catch (error: unknown) {
    console.error("POST /api/admin/skills error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to create skill" });
  }
});

/**
 * PUT /api/admin/skills/:id
 * Updates an existing skill by ID
 */
router.put("/skills/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid skill ID format" });
    }

    const parseResult = skillInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const { category, name, level, order, visible } = parseResult.data;

    // Check if another skill with the same name exists in this category
    const conflict = await Skill.findOne({
      _id: { $ne: id },
      category,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (conflict) {
      return res.status(409).json({
        error: `Skill "${name}" already exists in ${category}`,
      });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      {
        $set: {
          category,
          name,
          level,
          order,
          visible,
        },
      },
      { new: true, runValidators: true }
    )
      .select("-__v")
      .lean();

    if (!updatedSkill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    return res.status(200).json({
      ok: true,
      skill: updatedSkill,
    });
  } catch (error: unknown) {
    console.error("PUT /api/admin/skills/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to update skill" });
  }
});

/**
 * DELETE /api/admin/skills/:id
 * Deletes a skill by ID
 */
router.delete("/skills/:id", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid skill ID format" });
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const deleted = await Skill.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ error: "Skill not found" });
    }

    return res.status(200).json({
      ok: true,
      message: `Skill "${deleted.name}" deleted successfully`,
    });
  } catch (error: unknown) {
    console.error("DELETE /api/admin/skills/:id error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to delete skill" });
  }
});

export default router;

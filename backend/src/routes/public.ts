import { Router, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import SiteSettings from "../models/SiteSettings";
import Skill from "../models/Skill";
import Project from "../models/Project";
import Journey from "../models/Journey";
import { publicGetRateLimiter } from "../middleware/rateLimit";

const router = Router();

// Rate limiter: 100 requests per minute per IP from Step 8
router.use(publicGetRateLimiter);

// Cache-Control header: allow CDN caching with instant client revalidation
router.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
  next();
});

let lastConnectAttempt = 0;

// Helper for connecting to DB with timeout & retry cooldown to ensure fast responses
const connectWithTimeout = async (ms = 1500): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const now = Date.now();
  // If a recent attempt failed, wait 30s before retrying to prevent request lag
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

// Real content fallbacks (used when DB is empty or during local dev before seeding in Step 33)
const FALLBACK_SITE = {
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

const FALLBACK_PROJECTS = [
  {
    title: "FixFlow",
    slug: "fixflow",
    shortDescription: "Campus complaint workflow system with multi-role routing, SLA tracking, and AI triage.",
    longDescription: "End-to-end grievance management platform for colleges featuring 3 roles (student, staff, admin), OTP authentication, AI complaint categorization and duplicate detection, SLA countdowns, and PWA capabilities.",
    stack: ["React 19", "Node.js", "Express 5", "MongoDB", "Tailwind 4", "Gemini AI"],
    imageUrl: "/images/fixflow-card.png",
    githubUrl: "https://github.com/FixFlow-Official/FixFlow",
    liveUrl: null,
    featured: true,
    order: 1,
    caseStudy: {
      overview: "FixFlow was created to eliminate lost paper complaints, chaotic messaging groups, and unaccountable campus maintenance requests by providing a transparent digital grievance workflow.",
      challenge: "Colleges struggle with high complaint volume, redundant reports of the same outage, unmonitored repair delays, and zero accountability between students and administration.",
      solution: "Engineered a production-ready MERN system with role-based access, automated SLA timers, Gemini AI triage to cluster duplicates, live room QR scanning, and push notifications.",
      outcome: "Built to hold up beyond the demo with 37,612 lines of code across 183 files, 43 automated test suites, and robust multi-tier authentication.",
    },
    resultText: "37,612 lines · 183 files · 43 tests",
  },
  {
    title: "Kohinoor Tunes",
    slug: "kohinoor-tunes",
    shortDescription: "Free, open-source music streaming client with background audio playback and zero ads.",
    longDescription: "A personalized, sleek audio player designed for uninterrupted listening with local playlists, background audio playback, and clean UI.",
    stack: ["React Native", "TypeScript", "Expo", "Audio API"],
    imageUrl: "/images/kohinoor-tunes.png",
    githubUrl: "https://github.com/kohinoorsingh0/KohinoorTunes",
    liveUrl: null,
    featured: false,
    order: 2,
    caseStudy: {
      overview: "Kohinoor Tunes is a community-first audio application focused on speed, zero ad interruptions, and intuitive playlist management.",
      challenge: "Most music apps are bloated with sponsored promotions, heavy analytics, and aggressive paywalls that hinder simple listening.",
      solution: "Developed an uncluttered mobile streaming player leveraging high-performance audio decoders and minimalist aesthetic principles.",
      outcome: "Delivered a daily-driver music app used by friends and peers with rock-solid playback stability.",
    },
    resultText: "Open-source audio player",
  },
];

const FALLBACK_JOURNEY = [
  {
    type: "Experience",
    yearLabel: "2026",
    title: "Full-Stack Developer",
    organisation: "FixFlow · Campus Complaint System (College Project)",
    description: "Architected and built an end-to-end campus complaint workflow system (37,612 lines of code, 183 files, 43 tests). Built 3 roles (student, staff, admin), OTP email verification, SLA tracking, AI triage with duplicate detection, campus heatmap, and PWA capabilities.",
    order: 1,
    visible: true,
  },
  {
    type: "Certificate",
    yearLabel: "2026",
    title: "Full Stack Development with AI",
    organisation: "PW Skills",
    description: "Completed comprehensive certification on 27 September 2026. Covered full-stack architecture, React, Node.js, Express, MongoDB, REST APIs, and generative AI system integration.",
    order: 2,
    visible: true,
  },
  {
    type: "Education",
    yearLabel: "",
    title: "Bachelor of Computer Applications (B.C.A.)",
    organisation: "Pt. Chiranji Lal Sharma Govt. P.G. College, Karnal",
    description: "B.C.A. Web Development. Specializing in computer science fundamentals, data structures, algorithms, web technologies, and database management systems. Currently pursuing.",
    order: 3,
    visible: true,
  },
];

// 1. GET /api/site
router.get("/site", async (_req: Request, res: Response) => {
  try {
    await connectWithTimeout();
    const site = await SiteSettings.findOne().select("-__v -_id").lean();
    if (site) {
      return res.status(200).json(site);
    }
  } catch (err) {
    // Return verified fallback when DB is unreachable or unseeded
  }
  return res.status(200).json(FALLBACK_SITE);
});

// 2. GET /api/skills
router.get("/skills", async (_req: Request, res: Response) => {
  try {
    await connectWithTimeout();
    const skills = await Skill.find({ visible: true })
      .sort({ order: 1 })
      .select("-__v")
      .lean();
    if (skills && skills.length > 0) {
      return res.status(200).json(skills);
    }
  } catch (err) {
    // Return verified fallback
  }
  return res.status(200).json(FALLBACK_SKILLS);
});

// 3. GET /api/projects
router.get("/projects", async (_req: Request, res: Response) => {
  try {
    await connectWithTimeout();
    const projects = await Project.find({
      $or: [{ visible: true }, { visible: { $exists: false } }],
    })
      .sort({ order: 1 })
      .select("-__v")
      .lean();
    return res.status(200).json(projects || []);
  } catch (err) {
    // Return verified fallback only if DB is unreachable
    return res.status(200).json(FALLBACK_PROJECTS);
  }
});

// 4. GET /api/projects/:slug
router.get("/projects/:slug", async (req: Request, res: Response) => {
  const rawSlug = req.params.slug;
  const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || "")
    .toLowerCase()
    .trim();
  try {
    await connectWithTimeout();
    const project = await Project.findOne({
      slug,
      $or: [{ visible: true }, { visible: { $exists: false } }],
    })
      .select("-__v")
      .lean();
    if (project) {
      return res.status(200).json(project);
    }
    // Database is connected: project was deleted or does not exist
    return res.status(404).json({ message: "Project not found" });
  } catch (err) {
    // Only if DB connection failed/timed out, fallback for local offline dev
    const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);
    if (fallback) {
      return res.status(200).json(fallback);
    }
    return res.status(404).json({ message: "Project not found" });
  }
});

// 5. GET /api/journey
router.get("/journey", async (_req: Request, res: Response) => {
  try {
    await connectWithTimeout();
    const journey = await Journey.find({ visible: true })
      .sort({ order: 1 })
      .select("-__v")
      .lean();
    if (journey && journey.length > 0) {
      return res.status(200).json(journey);
    }
  } catch (err) {
    // Return verified fallback
  }
  return res.status(200).json(FALLBACK_JOURNEY);
});

export default router;

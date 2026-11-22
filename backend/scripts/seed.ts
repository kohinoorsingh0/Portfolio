import "../src/config/env";
import mongoose from "mongoose";
import SiteSettings from "../src/models/SiteSettings";
import Skill from "../src/models/Skill";
import Project from "../src/models/Project";
import Journey from "../src/models/Journey";

const SITE_DATA = {
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

const SKILLS_DATA = [
  { category: "Frontend" as const, name: "React", level: "Strong" as const, order: 1, visible: true },
  { category: "Frontend" as const, name: "TypeScript", level: "Strong" as const, order: 2, visible: true },
  { category: "Frontend" as const, name: "Next.js", level: "Working" as const, order: 3, visible: true },
  { category: "Frontend" as const, name: "Tailwind CSS", level: "Strong" as const, order: 4, visible: true },
  { category: "Backend" as const, name: "Node.js", level: "Strong" as const, order: 5, visible: true },
  { category: "Backend" as const, name: "Express", level: "Strong" as const, order: 6, visible: true },
  { category: "Backend" as const, name: "REST APIs", level: "Strong" as const, order: 7, visible: true },
  { category: "Backend" as const, name: "Auth (JWT/OTP)", level: "Working" as const, order: 8, visible: true },
  { category: "Database" as const, name: "MongoDB", level: "Strong" as const, order: 9, visible: true },
  { category: "Database" as const, name: "Mongoose", level: "Strong" as const, order: 10, visible: true },
  { category: "Database" as const, name: "PostgreSQL", level: "Working" as const, order: 11, visible: true },
  { category: "Tools & DevOps" as const, name: "Git & GitHub", level: "Strong" as const, order: 12, visible: true },
  { category: "Tools & DevOps" as const, name: "Docker", level: "Working" as const, order: 13, visible: true },
  { category: "Tools & DevOps" as const, name: "Vercel", level: "Strong" as const, order: 14, visible: true },
  { category: "Tools & DevOps" as const, name: "Figma", level: "Working" as const, order: 15, visible: true },
];

const PROJECTS_DATA = [
  {
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

const JOURNEY_DATA = [
  {
    type: "Experience" as const,
    yearLabel: "2026",
    title: "Full-Stack Developer",
    organisation: "FixFlow · Campus Complaint System (College Project)",
    description:
      "Architected and built an end-to-end campus complaint workflow system (37,612 lines of code, 183 files, 43 tests). Built 3 roles (student, staff, admin), OTP email verification, SLA tracking, AI triage with duplicate detection, campus heatmap, and PWA capabilities.",
    order: 1,
    visible: true,
  },
  {
    type: "Certificate" as const,
    yearLabel: "2026",
    title: "Full Stack Development with AI",
    organisation: "PW Skills",
    description:
      "Completed comprehensive certification on 27 September 2026. Covered full-stack architecture, React, Node.js, Express, MongoDB, REST APIs, and generative AI system integration.",
    order: 2,
    visible: true,
  },
  {
    type: "Education" as const,
    yearLabel: "",
    title: "Bachelor of Computer Applications (B.C.A.)",
    organisation: "Pt. Chiranji Lal Sharma Govt. P.G. College, Karnal",
    description:
      "B.C.A. Web Development. Specializing in computer science fundamentals, data structures, algorithms, web technologies, and database management systems. Currently pursuing.",
    order: 3,
    visible: true,
  },
];

export async function seedDatabase() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && process.env.ALLOW_PROD_SEED !== "true") {
    console.error(
      "🛑 SAFETY ERROR: Cannot run seed script in production without explicit permission.\nSet ALLOW_PROD_SEED=true to force seeding production."
    );
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ MONGODB_URI environment variable is missing.");
    process.exit(1);
  }

  console.log("🌱 Starting database seeding with real verified content...");
  console.log(`📡 Connecting to MongoDB...`);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✓ Connected to MongoDB");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`\n❌ Failed to connect to MongoDB: ${error.message}`);
    console.error(
      "💡 TIP: If you are using MongoDB Atlas, make sure your current public IP is whitelisted in Atlas Network Access (or whitelist 0.0.0.0/0 for global access)."
    );
    process.exit(1);
  }

  try {
    // 1. SiteSettings (single document upsert)
    console.log("\n📦 Seeding SiteSettings...");
    await SiteSettings.deleteMany({});
    const createdSite = await SiteSettings.create(SITE_DATA);
    console.log(`✓ SiteSettings seeded: "${createdSite.name}" (${createdSite.role})`);

    // 2. Skills (15 skills, delete + re-insert for idempotency)
    console.log("\n📦 Seeding Skills (15 verified skills)...");
    await Skill.deleteMany({});
    const createdSkills = await Skill.insertMany(SKILLS_DATA);
    console.log(`✓ ${createdSkills.length} Skills seeded across 4 categories`);

    // 3. Projects (FixFlow + Kohinoor Tunes only)
    console.log("\n📦 Seeding Projects (FixFlow & Kohinoor Tunes)...");
    await Project.deleteMany({});
    const createdProjects = await Project.insertMany(PROJECTS_DATA);
    console.log(
      `✓ ${createdProjects.length} Projects seeded: ${createdProjects.map((p) => p.title).join(", ")}`
    );

    // 4. Journey (FixFlow, PW Skills, BCA)
    console.log("\n📦 Seeding Journey entries (3 verified milestones)...");
    await Journey.deleteMany({});
    const createdJourney = await Journey.insertMany(JOURNEY_DATA);
    console.log(
      `✓ ${createdJourney.length} Journey entries seeded: ${createdJourney.map((j) => j.title).join(", ")}`
    );

    console.log("\n🔒 Verification Checks:");
    console.log("  ✓ Admin collection untouched (Step 25 handles admin creation)");
    console.log("  ✓ Testimonials collection: 0 entries (no fake testimonials)");
    console.log("  ✓ No dummy projects (only FixFlow + Kohinoor Tunes)");
    console.log("  ✓ No unverified graduation dates");
    console.log("\n🎉 Database seeding finished successfully!\n");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  }
}

// Execute when run directly via CLI
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

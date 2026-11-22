/**
 * Single fetch wrapper for Frontend <-> Backend communication
 * - Credentials: include ONLY for admin calls, NEVER for public GETs
 * - Public GETs use { next: { revalidate: 60 } } for Next.js caching & ISR
 * - Robust error handling with verified fallbacks so SSR/build never crashes
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

// Data types matching MongoDB Atlas schemas & backend routes

export interface SiteSettingsData {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  heroTitle: string;
  heroHighlightWord: string;
  profilePhotoUrl: string;
  resumeUrl: string;
}

export interface SkillData {
  _id?: string;
  category: "Frontend" | "Backend" | "Database" | "Tools & DevOps";
  name: string;
  level: "Strong" | "Working" | "Beginner";
  order: number;
  visible?: boolean;
}

export interface ProjectData {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  imageUrl?: string;
  stack: string[];
  githubUrl: string;
  liveUrl?: string | null;
  featured: boolean;
  order: number;
  visible?: boolean;
  caseStudy?: {
    overview: string;
    challenge: string;
    solution: string;
    outcome: string;
  };
  resultText?: string;
}

export interface JourneyData {
  _id?: string;
  type: "Experience" | "Education" | "Certificate";
  yearLabel: string;
  title: string;
  organisation: string;
  description: string;
  order: number;
  visible?: boolean;
}

// Verified real content fallbacks if DB is empty or backend is unreachable during static builds
export const FALLBACK_SITE: SiteSettingsData = {
  name: "Kohinoor Singh",
  role: "Full-Stack Developer",
  tagline: "I build fast, beautiful web products.",
  bio: "Full-stack developer building deliberate web products, accessible interfaces, and robust systems.",
  location: "Karnal, India",
  availability: "Internships & Junior roles",
  email: "kohinoorsingh040@gmail.com",
  phone: "9350666578",
  whatsapp: "https://wa.me/919350666578",
  github: "https://github.com/kohinoorsingh0",
  linkedin: "https://www.linkedin.com/in/kohinoor-singh-5137b9413/",
  heroTitle: "I build fast, beautiful web products.",
  heroHighlightWord: "beautiful",
  profilePhotoUrl: "/images/kohinoor-watercolor.jpg",
  resumeUrl: "/resume/kohinoor-singh-resume.pdf",
};

export const FALLBACK_SKILLS: SkillData[] = [
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

export const FALLBACK_PROJECTS: ProjectData[] = [
  {
    title: "FixFlow",
    slug: "fixflow",
    shortDescription: "Campus complaint workflow system, MERN.",
    longDescription:
      "End-to-end grievance management platform for colleges featuring 3 roles (student, staff, admin), OTP authentication, AI complaint categorization and duplicate detection, SLA countdowns, and PWA capabilities.",
    imageUrl: "/images/fixflow-card.png",
    stack: ["React 19", "Node.js", "Express 5", "MongoDB", "Tailwind 4", "Gemini AI"],
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
    imageUrl: "/images/kohinoor-tunes.png",
    stack: ["React Native", "TypeScript", "Expo", "Audio API"],
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

export const FALLBACK_JOURNEY: JourneyData[] = [
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
 * Generic public fetcher (no credentials, 60s revalidation)
 */
async function fetchPublic<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const url = `${API_BASE_URL}/${endpoint.replace(/^\//, "")}`;
    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return fallback;
    }

    const data = await res.json();
    return (data as T) || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Public Data Fetchers
 */

export async function getSiteSettings(): Promise<SiteSettingsData> {
  return fetchPublic<SiteSettingsData>("site", FALLBACK_SITE);
}

export async function getSkills(): Promise<SkillData[]> {
  const skills = await fetchPublic<SkillData[]>("skills", FALLBACK_SKILLS);
  return skills && skills.length > 0 ? skills : FALLBACK_SKILLS;
}

export async function getProjects(): Promise<ProjectData[]> {
  const projects = await fetchPublic<ProjectData[]>("projects", FALLBACK_PROJECTS);
  return projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
  try {
    const url = `${API_BASE_URL}/projects/${slug}`;
    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall back to local search
  }
  const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);
  return fallback || null;
}

export async function getJourney(): Promise<JourneyData[]> {
  const journey = await fetchPublic<JourneyData[]>("journey", FALLBACK_JOURNEY);
  return journey && journey.length > 0 ? journey : FALLBACK_JOURNEY;
}

/**
 * Trigger instant on-demand cache revalidation across public Next.js pages
 */
export async function triggerRevalidation(path: string = "all") {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
  } catch {
    // Non-blocking
  }
}

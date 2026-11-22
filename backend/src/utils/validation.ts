import { z } from "zod";

/**
 * Strips HTML tags and trims whitespace from a string
 */
export const stripHtml = (val: string): string =>
  val.replace(/<[^>]*>?/gm, "").trim();

/**
 * Zod string transform that strips HTML and enforces max length
 */
export const sanitizedString = (maxLength: number = 500) =>
  z
    .string()
    .max(maxLength, `Maximum length is ${maxLength} characters`)
    .transform((val) => stripHtml(val));

/**
 * Accepts valid HTTP/HTTPS URLs, root-relative file paths (/images/...), or empty string
 */
export const urlOrPath = (errorMsg: string = "Invalid URL or path") =>
  z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        if (val.startsWith("/")) return true;
        try {
          const parsed = new URL(val);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: errorMsg }
    )
    .default("");

/**
 * 1. Admin Login Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email is too long")
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * 2. Contact Message Schema
 */
export const contactSchema = z.object({
  name: sanitizedString(100).refine((val) => val.length > 0, "Name is required"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email is too long")
    .toLowerCase(),
  message: sanitizedString(2000).refine(
    (val) => val.length > 0,
    "Message is required"
  ),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * 3. Skill Schema (NO percentage field)
 */
export const skillValidationSchema = z.object({
  category: z.enum(["Frontend", "Backend", "Database", "Tools & DevOps"], {
    errorMap: () => ({
      message:
        "Category must be Frontend, Backend, Database, or Tools & DevOps",
    }),
  }),
  name: sanitizedString(100).refine((val) => val.length > 0, "Name is required"),
  level: z.enum(["Beginner", "Working", "Strong"], {
    errorMap: () => ({
      message: "Level must be Beginner, Working, or Strong",
    }),
  }),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export type SkillInput = z.infer<typeof skillValidationSchema>;

/**
 * Case Study Schema
 */
export const caseStudyValidationSchema = z.object({
  overview: sanitizedString(2000).default(""),
  challenge: sanitizedString(2000).default(""),
  solution: sanitizedString(2000).default(""),
  outcome: sanitizedString(2000).default(""),
});

/**
 * 4. Project Schema
 */
export const projectValidationSchema = z.object({
  title: sanitizedString(200).refine((val) => val.length > 0, "Title is required"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(200, "Slug is too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase alphanumeric characters and hyphens"
    ),
  shortDescription: sanitizedString(500).refine(
    (val) => val.length > 0,
    "Short description is required"
  ),
  longDescription: sanitizedString(5000).default(""),
  stack: z.array(sanitizedString(50)).default([]),
  imageUrl: urlOrPath("Invalid image URL"),
  githubUrl: z
    .string()
    .trim()
    .url("Invalid GitHub URL")
    .or(z.literal(""))
    .optional()
    .nullable(),
  liveUrl: z
    .string()
    .trim()
    .url("Invalid live URL")
    .or(z.literal(""))
    .optional()
    .nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  caseStudy: caseStudyValidationSchema.default({
    overview: "",
    challenge: "",
    solution: "",
    outcome: "",
  }),
  resultText: sanitizedString(500).optional().nullable(),
});

export type ProjectInput = z.infer<typeof projectValidationSchema>;

/**
 * 5. Journey Schema
 */
export const journeyValidationSchema = z.object({
  type: z.enum(["Experience", "Education", "Certificate"], {
    errorMap: () => ({
      message: "Type must be Experience, Education, or Certificate",
    }),
  }),
  yearLabel: sanitizedString(50).refine(
    (val) => val.length > 0,
    "Year label is required"
  ),
  title: sanitizedString(200).refine((val) => val.length > 0, "Title is required"),
  organisation: sanitizedString(200).refine(
    (val) => val.length > 0,
    "Organisation is required"
  ),
  description: sanitizedString(2000).default(""),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export type JourneyInput = z.infer<typeof journeyValidationSchema>;

/**
 * 6. Site Settings Schema
 */
export const siteSettingsValidationSchema = z.object({
  name: sanitizedString(100).refine((val) => val.length > 0, "Name is required"),
  role: sanitizedString(100).refine((val) => val.length > 0, "Role is required"),
  tagline: sanitizedString(300).default(""),
  bio: sanitizedString(2000).default(""),
  location: sanitizedString(100).default(""),
  availability: sanitizedString(100).default(""),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email is too long")
    .toLowerCase(),
  phone: sanitizedString(50).default(""),
  whatsapp: sanitizedString(50).default(""),
  github: z
    .string()
    .trim()
    .url("Invalid GitHub URL")
    .or(z.literal(""))
    .default(""),
  linkedin: z
    .string()
    .trim()
    .url("Invalid LinkedIn URL")
    .or(z.literal(""))
    .default(""),
  heroTitle: sanitizedString(300).default(""),
  heroHighlightWord: sanitizedString(100).default(""),
  profilePhotoUrl: urlOrPath("Invalid profile photo URL"),
  resumeUrl: urlOrPath("Invalid resume URL"),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsValidationSchema>;

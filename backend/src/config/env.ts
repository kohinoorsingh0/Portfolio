import fs from "fs";
import path from "path";
import { z } from "zod";

// Automatically load .env file if present
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // Ignore read errors
  }
}

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.string().default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  CONTACT_EMAIL: z.string().min(1, "CONTACT_EMAIL is required"),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
});

export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missingKeys = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    console.error(`\n❌ Missing or invalid required environment variables:\n${missingKeys}\n`);
    throw new Error(`Missing required backend environment variables:\n${missingKeys}`);
  }
  return result.data;
};

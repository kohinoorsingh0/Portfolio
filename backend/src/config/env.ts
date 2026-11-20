import fs from "fs";
import path from "path";
import { z } from "zod";

// Automatically load .env file if present
const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env"),
];
for (const p of candidates) {
  if (fs.existsSync(p) && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(p);
      break;
    } catch {
      // Ignore read errors
    }
  }
}

const envSchema = z.object({
  PORT: z.string().min(1, "PORT is required"),
  NODE_ENV: z.string().default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),
  CONTACT_EMAIL: z.string().min(1, "CONTACT_EMAIL is required"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),
});

const printEnvStatus = () => {
  const isPresent = (key: string): boolean => {
    const val = process.env[key];
    return typeof val === "string" && val.trim().length > 0;
  };

  const rows: Array<{ key: string; optionalMsg?: string }> = [
    { key: "PORT" },
    { key: "MONGODB_URI" },
    { key: "JWT_SECRET" },
    { key: "FRONTEND_URL" },
    { key: "CONTACT_EMAIL" },
    {
      key: "SMTP_USER",
      optionalMsg: "missing — optional, contact email disabled",
    },
    {
      key: "SMTP_PASS",
      optionalMsg: "missing — optional, contact email disabled",
    },
    {
      key: "CLOUDINARY_CLOUD_NAME",
      optionalMsg: "missing — optional, image upload disabled",
    },
    {
      key: "CLOUDINARY_API_KEY",
      optionalMsg: "missing — optional, image upload disabled",
    },
    {
      key: "CLOUDINARY_API_SECRET",
      optionalMsg: "missing — optional, image upload disabled",
    },
  ];

  for (const row of rows) {
    if (isPresent(row.key)) {
      console.log(`[env] ✓ ${row.key}: present`);
    } else {
      const detail = row.optionalMsg ? row.optionalMsg : "missing";
      console.log(`[env] ✗ ${row.key}: ${detail}`);
    }
  }
};

export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);

  printEnvStatus();

  if (!result.success) {
    const missingKeys = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    console.error(
      `\n❌ Missing or invalid required environment variables:\n${missingKeys}\n`
    );
    throw new Error(
      `Missing required backend environment variables:\n${missingKeys}`
    );
  }

  return result.data;
};

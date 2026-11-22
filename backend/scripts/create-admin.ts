import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db";
import Admin from "../src/models/Admin";

// Load backend .env for base configuration (e.g., MONGODB_URI)
import "../src/config/env";

interface AdminCredentials {
  email?: string;
  password?: string;
  mongoUri?: string;
}

/**
 * Reads ADMIN_EMAIL and plain ADMIN_PASSWORD from .env.local ONLY at script runtime
 */
function readCredentialsFromEnvLocal(): AdminCredentials {
  const candidatePaths = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), "backend/.env.local"),
    path.resolve(__dirname, "../../.env.local"),
    path.resolve(__dirname, "../.env.local"),
  ];

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, "utf-8");
        const lines = content.split("\n");
        let email: string | undefined;
        let password: string | undefined;
        let mongoUri: string | undefined;

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (key === "ADMIN_EMAIL") email = val;
            if (key === "ADMIN_PASSWORD") password = val;
            if (key === "MONGODB_URI") mongoUri = val;
          }
        }

        if (email && password) {
          return { email, password, mongoUri };
        }
      } catch (err) {
        console.warn(`Could not read ${envPath}:`, (err as Error).message);
      }
    }
  }

  // Fallback to process.env if present
  return {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    mongoUri: process.env.MONGODB_URI,
  };
}

async function createAdmin() {
  const credentials = readCredentialsFromEnvLocal();

  if (!credentials.email || !credentials.password) {
    console.error("❌ Error: ADMIN_EMAIL or ADMIN_PASSWORD missing from .env.local");
    console.error(
      "Please ensure a .env.local file exists with:\n  ADMIN_EMAIL=your_email@example.com\n  ADMIN_PASSWORD=your_plain_password\n"
    );
    process.exit(1);
  }

  if (credentials.mongoUri) {
    process.env.MONGODB_URI = credentials.mongoUri;
  }

  try {
    await connectDB();
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`❌ Database connection failed: ${error.message}`);
    console.error(
      "💡 TIP: If using MongoDB Atlas, ensure your current IP is whitelisted in Atlas Network Access."
    );
    process.exit(1);
  }

  try {
    // Hash plain password with 12 bcrypt rounds
    const passwordHash = await bcrypt.hash(credentials.password, 12);

    // Hard Rule 8: Single admin only. Remove existing admin and create the single admin document.
    await Admin.deleteMany({});
    await Admin.create({
      email: credentials.email.toLowerCase().trim(),
      passwordHash,
    });

    // Print strictly "Admin created" — NEVER print the password or hash
    console.log("Admin created");
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`❌ Failed to create admin: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Execute when invoked from CLI
if (require.main === module) {
  createAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

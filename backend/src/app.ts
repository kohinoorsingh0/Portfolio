import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import publicRoutes from "./routes/public";
import contactRoutes from "./routes/contact";
import adminAuthRoutes from "./routes/adminAuth";
import adminSettingsRoutes from "./routes/adminSettings";
import adminSkillsRoutes from "./routes/adminSkills";
import adminProjectsRoutes from "./routes/adminProjects";
import adminUploadRoutes from "./routes/adminUpload";
import adminJourneyRoutes from "./routes/adminJourney";
import adminMessagesRoutes from "./routes/adminMessages";
import { adminRateLimiter } from "./middleware/rateLimit";

const app = express();

const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((u) => u.trim().replace(/\/$/, ""))
  .filter(Boolean);

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "https://portfolio-lime-ten-t4qdjdxqb5.vercel.app",
  "https://kohinoorsingh.netlify.app",
];

const isAllowedOrigin = (origin: string): boolean => {
  const clean = origin.replace(/\/$/, "");
  if (configuredOrigins.includes(clean) || defaultAllowedOrigins.includes(clean)) {
    return true;
  }
  // Allow Vercel preview/production deployments
  if (/^https:\/\/portfolio-[a-z0-9-]+\.vercel\.app$/.test(clean)) {
    return true;
  }
  // Allow Netlify branch/deploy previews
  if (/^https:\/\/[a-z0-9-]+--kohinoorsingh\.netlify\.app$/.test(clean)) {
    return true;
  }
  return false;
};

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

// Public read APIs
app.use("/api", publicRoutes);

// Contact & Resume APIs
app.use("/api", contactRoutes);

// Rate limiter for all Admin APIs
app.use("/api/admin", adminRateLimiter);

// Admin Auth APIs
app.use("/api/admin", adminAuthRoutes);

// Admin Settings APIs
app.use("/api/admin", adminSettingsRoutes);

// Admin Skills APIs
app.use("/api/admin", adminSkillsRoutes);

// Admin Projects APIs
app.use("/api/admin", adminProjectsRoutes);

// Admin Upload APIs
app.use("/api/admin", adminUploadRoutes);

// Admin Journey APIs
app.use("/api/admin", adminJourneyRoutes);

// Admin Messages APIs
app.use("/api/admin", adminMessagesRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

export default app;

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

const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const frontendUrl = rawFrontendUrl.replace(/\/$/, "");

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (cleanOrigin === frontendUrl) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
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

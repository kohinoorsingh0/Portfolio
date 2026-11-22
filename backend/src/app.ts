import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import publicRoutes from "./routes/public";
import contactRoutes from "./routes/contact";
import adminAuthRoutes from "./routes/adminAuth";
import adminSettingsRoutes from "./routes/adminSettings";
import adminSkillsRoutes from "./routes/adminSkills";
import adminProjectsRoutes from "./routes/adminProjects";

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(helmet());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(express.json());

// Public read APIs
app.use("/api", publicRoutes);

// Contact & Resume APIs
app.use("/api", contactRoutes);

// Admin Auth APIs
app.use("/api/admin", adminAuthRoutes);

// Admin Settings APIs
app.use("/api/admin", adminSettingsRoutes);

// Admin Skills APIs
app.use("/api/admin", adminSkillsRoutes);

// Admin Projects APIs
app.use("/api/admin", adminProjectsRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

export default app;

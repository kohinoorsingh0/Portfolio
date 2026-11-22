import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import publicRoutes from "./routes/public";
import contactRoutes from "./routes/contact";
import adminAuthRoutes from "./routes/adminAuth";

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

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

export default app;

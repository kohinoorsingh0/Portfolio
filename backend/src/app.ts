import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

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

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

export default app;

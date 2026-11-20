import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;

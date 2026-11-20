import app from "./app";
import { validateEnv } from "./config/env";

const PORT = process.env.PORT || 5000;

// Validate environment variables on startup
if (process.env.SKIP_ENV_VALIDATION !== "true") {
  validateEnv();
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;

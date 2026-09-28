// backend/src/server.ts
// Responsibility: Application entry point

import "dotenv/config";
import app from "./app";
import config from "./config/env";

app.listen(config.port, () => {
  console.log(`Hospital SaaS backend listening on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

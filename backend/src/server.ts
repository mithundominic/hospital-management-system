// Responsibility: Application entry point
// backend/src/server.ts

import "dotenv/config";
import app from "./app";
import config from "./config/env";

const startServer = (port: number) => {
  const server = app.listen(port, () => {
    console.log(`Hospital SaaS backend listening on port ${port}`);
    console.log(`Environment: ${config.nodeEnv}`);

    if (port !== config.port) {
      console.log(
        `⚠️  NOTE: Started on port ${port} instead of ${config.port} (port was busy)`,
      );
      console.log(
        `⚠️  Update frontend VITE_API_URL to: http://localhost:${port}`,
      );
    }
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
};

// Try ports starting from config.port (3000, 3001, 3002, ...)
startServer(config.port);

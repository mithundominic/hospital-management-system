// Responsibility: Express application composition and middleware orchestration

import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/env";
import { corsOptions } from "./config/cors";
import { auth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { compressionMiddleware, cacheControlMiddleware } from "./middleware/httpOptimization";
import { registerPublicRoutes } from "./routes/public";
import { registerRoutes } from "./routes";
import { healthCheckHandler } from "./routes/health";
import { sendError } from "./utils/respond";

const app = express();

/* Security headers & proxy trust */
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: "deny" },
    noSniff: true,
  }),
);

/* Global middleware */
app.use(compressionMiddleware);
app.use(cacheControlMiddleware);
app.use(cors(corsOptions));
app.use(express.json({ limit: config.server.bodyLimit }));

/* Health check endpoint (bypasses rate limiter) */
app.get("/health", healthCheckHandler);

/* API v1 Application Router */
const apiV1 = express();

/* Apply rate limiting to API routes */
apiV1.use(apiRateLimiter);

/* Health check endpoint under /api/v1 */
apiV1.get("/health", healthCheckHandler);

/* Public routes (ABDM Gateway, onboarding) - no user JWT */
registerPublicRoutes(apiV1);

/* Protected routes - requires authentication */
apiV1.use(auth);
registerRoutes(apiV1);

/* 404 handler for API v1 routes */
apiV1.use((_req, res) => {
  sendError(res, 404, "NOT_FOUND", "Endpoint not found");
});

/* Error handler for API v1 routes */
apiV1.use(errorHandler);

/* Mount API router at /api/v1 */
app.use("/api/v1", apiV1);

/* 404 handler for root app */
app.use((_req, res) => {
  sendError(res, 404, "NOT_FOUND", "Endpoint not found");
});

/* Global error handler */
app.use(errorHandler);

export default app;

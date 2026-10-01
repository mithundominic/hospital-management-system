// Responsibility: Express application composition and middleware orchestration

import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/env";
import { corsOptions } from "./config/cors";
import { auth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { registerPublicRoutes } from "./routes/public";
import { registerRoutes } from "./routes";
import { healthCheckHandler } from "./routes/health";

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
app.use(cors(corsOptions));
app.use(express.json({ limit: config.server.bodyLimit }));

/* Health check endpoint (bypasses rate limiter) */
app.get("/health", healthCheckHandler);

/*
 * API v1 Application Router
 * Centralized mount point for versioned API routes (/api/v1)
 */
const apiV1 = express();

/* Apply rate limiting to API routes */
apiV1.use(apiRateLimiter);

/* Health check endpoint under /api/v1 */
apiV1.get("/health", healthCheckHandler);

/*
 * Public routes
 * These are called by external systems (ABDM Gateway, onboarding)
 * and must not require user JWT authentication.
 *
 * SECURITY: Public routes must implement their own verification
 * (signature verification, timestamp validation, etc.)
 */
registerPublicRoutes(apiV1);

/*
 * Protected routes
 * Everything registered below this middleware requires authentication.
 * User JWT must be valid and req.userId/req.supabase will be available.
 */
apiV1.use(auth);

registerRoutes(apiV1);

/* Error handler for API v1 routes */
apiV1.use(errorHandler);

/* Mount API router at /api/v1 and root for backwards compatibility */
app.use("/api/v1", apiV1);
app.use(apiV1);

/*
 * Global error handler
 * Must always be registered last to catch all errors.
 */
app.use(errorHandler);

export default app;

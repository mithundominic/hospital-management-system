// Responsibility: Centralized, user- and tenant-aware rate limiting middleware

import rateLimit, { Options } from "express-rate-limit";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env";
import { sendError } from "../utils/respond";
import { DatabaseRateLimitStore } from "../services/RateLimitStore";

/**
 * Resolve unique identifier: user-aware for authenticated calls, IP for anonymous
 * Note: We don't use the IP directly to avoid IPv6 issues - rate limiting is user-based
 */
export const resolveRateLimitKey = (req: Request): string => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    try {
      const decoded = jwt.decode(token) as { sub?: string } | null;
      if (decoded?.sub) {
        const hospitalMatch = req.url.match(/\/hospitals\/([a-f0-9-]+)/i);
        const hospitalId = hospitalMatch ? hospitalMatch[1] : null;
        return hospitalId
          ? `tenant:${hospitalId}:user:${decoded.sub}`
          : `user:${decoded.sub}`;
      }
    } catch {
      // Fall through to anonymous if token is malformed
    }
  }

  // For anonymous requests, use a static key (not IP-based)
  // This means anonymous requests share the same rate limit
  return `anonymous`;
};

const createLimiter = (prefix: string, options: Partial<Options>) =>
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: resolveRateLimitKey,
    store: new DatabaseRateLimitStore(prefix),
    validate: { singleCount: false },
    skip: (req: Request) =>
      req.path === "/health" || req.path === "/api/v1/health",
    handler: (_req: Request, res: Response) => {
      sendError(
        res,
        429,
        "RATE_LIMIT_EXCEEDED",
        "Too many requests. Please try again later.",
      );
    },
    skipSuccessfulRequests: false,
    ...options,
  });

/** Global API rate limiter for standard CRUD operations */
export const apiRateLimiter = createLimiter("api:", {
  limit: config.rateLimit.maxRequests,
});

/** Stricter rate limiter for sensitive routes (e.g. public onboarding) */
export const strictRateLimiter = createLimiter("strict:", {
  limit: config.rateLimit.authMaxRequests,
});

/** Rate limiter for heavy analytics & reporting queries */
export const reportsRateLimiter = createLimiter("reports:", {
  limit: Math.max(30, Math.floor(config.rateLimit.maxRequests / 5)),
});

/** Rate limiter for machine-to-machine integrations & device webhooks */
export const webhookRateLimiter = createLimiter("webhook:", {
  windowMs: 60000,
  limit: 120,
});

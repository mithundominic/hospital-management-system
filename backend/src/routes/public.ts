// Responsibility: Public route registration (no authentication required)

import type { Express } from "express";
import onboardingRouter from "./onboarding";
import abdmCallbacksRouter from "./abdmCallbacks";

/**
 * Register all public routes
 *
 * CRITICAL: These routes bypass JWT authentication
 * They are called by external systems or during initial setup:
 * - onboardingRouter: Hospital initial setup (no users exist yet)
 * - abdmCallbacksRouter: ABDM Gateway callbacks
 *
 * SECURITY NOTE: While these routes don't require user JWT,
 * they MUST implement their own verification:
 * - Onboarding: One-time setup tokens or other verification
 * - ABDM: Signature verification from ABDM Gateway
 * - Timestamp validation
 * - Request ID validation
 * - Payload schema validation
 *
 * See individual route files for security implementation details
 */
export const registerPublicRoutes = (app: Express): void => {
  app.use("/api/v1", onboardingRouter);
  app.use(onboardingRouter);
  app.use(abdmCallbacksRouter);
};

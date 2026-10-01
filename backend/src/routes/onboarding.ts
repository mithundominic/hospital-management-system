// Responsibility: Public onboarding route definitions and HTTP request handling

import { Router, Request, Response, NextFunction } from "express";
import { sendData, sendError } from "../utils/respond";
import { onboardNewHospital } from "../services/hospitals/OnboardingService";
import { strictRateLimiter } from "../middleware/rateLimiter";

const router = Router();

const handleOnboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      sendError(res, 400, "BAD_REQUEST", "Hospital name is required");
      return;
    }

    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    const result = await onboardNewHospital(req.body, bearerToken);
    sendData(res, result, 201);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Onboarding failed";
    if (msg.startsWith("UNAUTHENTICATED")) {
      sendError(res, 401, "UNAUTHENTICATED", msg.replace("UNAUTHENTICATED: ", ""));
      return;
    }
    if (msg.includes("already exists") || msg.includes("already registered")) {
      sendError(
        res,
        400,
        "INVALID_ONBOARDING_DATA",
        "Unable to complete onboarding with the provided details. Please verify your information.",
      );
      return;
    }
    if (
      msg.includes("Missing administrator credentials") ||
      msg.includes("Password must") ||
      msg.includes("Failed to create admin user") ||
      msg.includes("invalid")
    ) {
      sendError(res, 400, "BAD_REQUEST", msg);
      return;
    }
    next(err);
  }
};

router.post("/onboarding", strictRateLimiter, handleOnboard);
router.post("/hospitals/onboard", strictRateLimiter, handleOnboard);
router.post("/hospitals", strictRateLimiter, handleOnboard);

export default router;

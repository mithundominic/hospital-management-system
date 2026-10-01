// Responsibility: Public biometric webhook route with rate limiting
import express from "express";
import { webhookHandler } from "./biometric-webhook.handlers";
import { webhookRateLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/biometric/webhook", webhookRateLimiter, webhookHandler);

export default router;

// Responsibility: Public biometric webhook route (no authentication)

import express from "express";
import { webhookHandler } from "./biometric-webhook.handlers";

const router = express.Router();

/**
 * ABDM-style public webhook endpoint
 * NO AUTHENTICATION - called by ZKTeco device
 * Follows Rule 9: Auth Exceptions pattern
 *
 * Security: Validates device serial_number against registered devices
 */
router.post("/biometric/webhook", webhookHandler);

export default router;

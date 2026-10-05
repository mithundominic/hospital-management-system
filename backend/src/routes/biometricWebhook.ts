// Responsibility: Public biometric webhook route with rate limiting
import express from "express";
import { webhookHandler } from "./biometric-webhook.handlers";

const router = express.Router();

router.post("/biometric/webhook", webhookHandler);

export default router;

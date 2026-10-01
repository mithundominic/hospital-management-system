// Responsibility: JWT signature verification for ABDM gateway callbacks

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getAbdmSigningKey } from "../services/abdm/AbdmJwksClient";
import { validateCallbackTimestamp } from "../utils/validateCallbackTimestamp";
import { adminClient } from "../config/supabase";

/**
 * Log verification failure to abdm_callback_log
 */
async function logVerificationFailure(
  reason: string,
  body: unknown,
): Promise<void> {
  await adminClient.from("abdm_callback_log").insert({
    callback_type: "verification_failed",
    abdm_request_id: null,
    payload: { reason, body },
  });
}

/**
 * Express middleware to verify ABDM callback JWT signatures and timestamps
 * Validates Authorization Bearer JWT using JWKS public key from ABDM gateway
 * Rejects callbacks with invalid signatures or stale timestamps (>5 minutes old)
 */
export async function verifyAbdmCallback(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await logVerificationFailure("Missing or invalid Authorization header", req.body);
      res.status(401).json({ error: "Unauthorized: Missing Authorization header" });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Decode token to get kid (key ID) from header
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === "string" || !decoded.header.kid) {
      await logVerificationFailure("Invalid JWT structure", req.body);
      res.status(401).json({ error: "Unauthorized: Invalid JWT" });
      return;
    }

    // Get public key from JWKS using kid
    const publicKey = await getAbdmSigningKey(decoded.header.kid);

    // Verify JWT signature
    jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    // Validate timestamp in request body
    const timestamp = req.body?.timestamp;
    if (!timestamp || !validateCallbackTimestamp(timestamp)) {
      await logVerificationFailure("Stale or invalid timestamp", req.body);
      res.status(401).json({ error: "Unauthorized: Invalid or stale timestamp" });
      return;
    }

    // Verification successful - proceed to callback handler
    next();
  } catch (error) {
    await logVerificationFailure(
      error instanceof Error ? error.message : "Unknown error",
      req.body,
    );
    res.status(401).json({ error: "Unauthorized: JWT verification failed" });
  }
}

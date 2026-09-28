// Responsibility: Global error handler for uncaught route errors
// backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/respond";

/**
 * Global error handler middleware
 * Catches all errors that bubble up from routes
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err);
  sendError(res, 500, "INTERNAL_ERROR", "Something went wrong");
}

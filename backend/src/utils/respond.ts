// Responsibility: Standardized API response envelope helpers
// backend/src/utils/respond.ts

import { Response } from "express";
import { ApiSuccessResponse, ApiErrorResponse } from "../types";

/**
 * Send successful data response
 * @param res - Express response object
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 */
export function sendData<T>(
  res: Response,
  data: T,
  status: number = 200,
): void {
  const response: ApiSuccessResponse<T> = { data, error: null };
  res.status(status).json(response);
}

/**
 * Send error response
 * @param res - Express response object
 * @param status - HTTP status code
 * @param code - Error code
 * @param message - Error message
 */
export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
): void {
  const response: ApiErrorResponse = {
    data: null,
    error: { code, message },
  };
  res.status(status).json(response);
}

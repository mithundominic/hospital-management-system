// backend/src/types/express.types.ts
// Responsibility: Express.js type extensions and request/response types

import { Request, Response, NextFunction, RequestHandler } from "express";
import { SupabaseClient } from "@supabase/supabase-js";

// Extend Express Request with custom properties
export interface AuthenticatedRequest extends Request {
  userId: string;
  accessToken: string;
  supabase: SupabaseClient;
}

// Type-safe middleware function
export type AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

// Type-safe route handler using Express RequestHandler
export type RouteHandler = RequestHandler;

// Permission middleware factory return type
export type PermissionMiddleware = (
  permission: string,
  options?: { hospitalIdParam?: string },
) => AuthMiddleware;

// API response envelope types
export interface ApiSuccessResponse<T> {
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

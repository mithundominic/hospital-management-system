// backend/src/middleware/auth.ts
// Responsibility: JWT verification and user authentication

import { Request, Response, NextFunction } from 'express';
import { adminClient, userClient } from '../config/supabase';
import { sendError } from '../utils/respond';
import { AuthenticatedRequest } from '../types';

/**
 * Authentication middleware
 * Verifies JWT and attaches userId, accessToken, and user-scoped Supabase client
 */
export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    sendError(res, 401, 'UNAUTHENTICATED', 'Missing bearer token');
    return;
  }

  const { data, error } = await adminClient.auth.getUser(token);

  if (error || !data?.user) {
    sendError(res, 401, 'UNAUTHENTICATED', 'Invalid or expired token');
    return;
  }

  // Attach authenticated user info to request
  const authReq = req as AuthenticatedRequest;
  authReq.userId = data.user.id;
  authReq.accessToken = token;
  authReq.supabase = userClient(token);

  next();
}

// backend/src/config/supabase.ts
// Responsibility: Supabase client factories with proper typing
// Rule 15 Compliance: Uses centralized env config

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from './env';

const { url, anonKey, serviceRoleKey } = config.supabase;

/**
 * Admin client with service role key
 * Use ONLY for:
 * - JWT verification (auth.getUser)
 * - AuthorizationService RBAC checks
 * - ABDM callbacks (no user JWT available)
 * 
 * NEVER use for route data operations - bypasses RLS
 */
export const adminClient: SupabaseClient = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Create user-scoped Supabase client
 * @param accessToken - User's JWT access token
 * @returns Supabase client authenticated as the user (RLS applies)
 */
export function userClient(accessToken: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

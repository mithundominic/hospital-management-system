// Responsibility: Supabase client factories with proper typing
// backend/src/config/supabase.ts
// Rule 15 Compliance: Uses centralized env config

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import config from "./env";

const { url, publishableKey, secretKey, anonKey, serviceRoleKey } =
  config.supabase;
const effectiveKey = publishableKey || anonKey;
const effectiveSecret = secretKey || serviceRoleKey;

/**
 * Admin client with service role key
 * Use ONLY for:
 * - JWT verification (auth.getUser)
 * - AuthorizationService RBAC checks
 * - ABDM callbacks (no user JWT available)
 *
 * NEVER use for route data operations - bypasses RLS
 */
export const adminClient: SupabaseClient = createClient(url, effectiveSecret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const publicClient: SupabaseClient = createClient(url, effectiveKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Create user-scoped Supabase client
 * @param accessToken - User's JWT access token
 * @returns Supabase client authenticated as the user (RLS applies)
 */
export function userClient(accessToken: string): SupabaseClient {
  return createClient(url, effectiveKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

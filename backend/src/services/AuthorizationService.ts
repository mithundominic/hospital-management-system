// Responsibility: RBAC permission resolution via database function
// backend/src/services/AuthorizationService.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class AuthorizationService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseServiceRoleKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  /**
   * Check if user has permission at hospital
   * @param userId - User ID
   * @param hospitalId - Hospital ID
   * @param permission - Permission key (e.g., 'patients.read')
   * @returns True if user has permission
   */
  async can(
    userId: string,
    hospitalId: string,
    permission: string,
    scopedClient?: SupabaseClient,
  ): Promise<boolean> {
    const client = scopedClient || this.supabase;
    const { data, error } = await client.rpc(
      "rbac_effective_hospital_permission",
      {
        p_user_id: userId,
        p_hospital_id: hospitalId,
        p_permission: permission,
      },
    );

    if (error) {
      throw new Error(`Authorization check failed: ${error.message}`);
    }

    return data === true;
  }

  /**
   * Assert user has permission at hospital (throws if not)
   * @param userId - User ID
   * @param hospitalId - Hospital ID
   * @param permission - Permission key
   * @param scopedClient - Optional user-scoped Supabase client
   * @throws Error with code 'FORBIDDEN' if permission denied
   */
  async assert(
    userId: string,
    hospitalId: string,
    permission: string,
    scopedClient?: SupabaseClient,
  ): Promise<void> {
    const allowed = await this.can(userId, hospitalId, permission, scopedClient);

    if (!allowed) {
      const err = new Error(
        `User ${userId} lacks '${permission}' on hospital ${hospitalId}`,
      ) as Error & { code: string };
      err.code = "FORBIDDEN";
      throw err;
    }
  }
}

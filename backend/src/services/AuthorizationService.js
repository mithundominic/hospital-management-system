// backend/src/services/AuthorizationService.js
//
// Mirrors the Duzii pattern: Postgres holds the canonical RBAC model,
// this service is a thin consumer that calls the resolver function
// rather than re-implementing a permission matrix in application code.
// RLS (see the migrations) is the second, independent enforcement layer --
// this service is the one you call from route handlers for a fast,
// friendly denial before the query even reaches the database.

const { createClient } = require("@supabase/supabase-js");

class AuthorizationService {
  constructor(supabaseUrl, supabaseServiceRoleKey) {
    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  /**
   * @param {string} userId
   * @param {string} hospitalId
   * @param {string} permission - e.g. 'patients.read'
   * @returns {Promise<boolean>}
   */
  async can(userId, hospitalId, permission) {
    const { data, error } = await this.supabase.rpc(
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
   * Throws if the user lacks the permission. Use in route handlers /
   * middleware where a denial should short-circuit the request.
   */
  async assert(userId, hospitalId, permission) {
    const allowed = await this.can(userId, hospitalId, permission);
    if (!allowed) {
      const err = new Error(
        `User ${userId} lacks '${permission}' on hospital ${hospitalId}`,
      );
      err.code = "FORBIDDEN";
      throw err;
    }
  }
}

module.exports = { AuthorizationService };

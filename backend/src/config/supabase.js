// Responsibility: Supabase admin and per-request authenticated client factories
//
// Two different clients for two different jobs -- don't collapse these into
// one "just use the service role everywhere" client:
//
//  - adminClient: service-role key. Used for verifying JWTs (auth.getUser)
//    and by AuthorizationService's calls to the RBAC resolver functions.
//    Never use this for the actual data operations in the route files below
//    -- it bypasses RLS entirely, which would make every RLS policy from the
//    migrations decorative rather than a real second enforcement layer.
//  - userClient(accessToken): anon key + the requesting user's own JWT.
//    Every real data read/write goes through a client built this way, so
//    auth.uid() resolves correctly inside RLS policies and RLS actually runs
//    underneath the AuthorizationService check in requireHospitalPermission.
//
// Rule 15 Compliance: Uses centralized env config instead of direct process.env

const { createClient } = require("@supabase/supabase-js");
const config = require("./env");

const {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
} = config.supabase;

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function userClient(accessToken) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

module.exports = { adminClient, userClient };

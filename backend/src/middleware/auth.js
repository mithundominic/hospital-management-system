// src/middleware/auth.js
//
// Verifies the bearer token against Supabase Auth and attaches:
//  - req.userId       the authenticated user's id
//  - req.accessToken   the raw token (rarely needed directly, kept for convenience)
//  - req.supabase       a Supabase client authenticated AS this user -- every
//                        route handler should query through this, not adminClient,
//                        so RLS applies.
//
// Every route in this API assumes a logged-in staff member -- there's no
// public/anonymous endpoint in this surface, so this is mounted globally in
// app.js rather than per-route.

const { adminClient, userClient } = require('../config/supabase');
const { sendError } = require('../utils/respond');

async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return sendError(res, 401, 'UNAUTHENTICATED', 'Missing bearer token');
  }

  // Validating the token itself isn't a data operation subject to RLS, so
  // the admin client is the right tool here -- the one deliberate exception
  // to "route handlers use req.supabase, not adminClient."
  const { data, error } = await adminClient.auth.getUser(token);

  if (error || !data?.user) {
    return sendError(res, 401, 'UNAUTHENTICATED', 'Invalid or expired token');
  }

  req.userId = data.user.id;
  req.accessToken = token;
  req.supabase = userClient(token);

  next();
}

module.exports = { auth };

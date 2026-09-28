// src/middleware/requireHospitalPermission.js
//
// requireHospitalPermission('patients.read') reads hospitalId from
// req.params (defaults to :hospitalId, override via { hospitalIdParam }),
// then calls AuthorizationService.assert(). A denial becomes a 403 here,
// before any query touches a table the caller can't see -- RLS is still
// there underneath as the second, independent layer (see
// src/config/supabase.js for why route handlers use req.supabase, not the
// admin client, so that second layer actually runs).
//
// Rule 6 Compliance: Every hospital-scoped route must use this middleware
// Rule 15 Compliance: Uses centralized env config

const { AuthorizationService } = require("../services/AuthorizationService");
const { sendError } = require("../utils/respond");
const config = require("../config/env");

const authService = new AuthorizationService(
  config.supabase.url,
  config.supabase.serviceRoleKey,
);

function requireHospitalPermission(
  permission,
  { hospitalIdParam = "hospitalId" } = {},
) {
  return async function (req, res, next) {
    const hospitalId = req.params[hospitalIdParam];

    if (!hospitalId) {
      return sendError(
        res,
        400,
        "BAD_REQUEST",
        `Missing :${hospitalIdParam} in route`,
      );
    }

    try {
      await authService.assert(req.userId, hospitalId, permission);
      next();
    } catch (err) {
      if (err.code === "FORBIDDEN") {
        return sendError(res, 403, "FORBIDDEN", err.message);
      }
      next(err);
    }
  };
}

module.exports = { requireHospitalPermission };

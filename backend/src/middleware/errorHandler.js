// Responsibility: Global Express error handler formatting unexpected failures
// Last-resort handler for anything a route didn't catch itself, including
// Supabase/Postgres errors bubbling up via next(err).

const { sendError } = require("../utils/respond");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  sendError(res, 500, "INTERNAL_ERROR", "Something went wrong");
}

module.exports = { errorHandler };

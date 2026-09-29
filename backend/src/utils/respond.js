// Responsibility: Standard { data, error } HTTP response envelope formatter
// The { data, error } envelope documented in docs/API_SPEC.md, in one place
// so every route returns it the same shape.

function sendData(res, data, status = 200) {
  res.status(status).json({ data, error: null });
}

function sendError(res, status, code, message) {
  res.status(status).json({ data: null, error: { code, message } });
}

module.exports = { sendData, sendError };

'use strict';

/**
 * Format a standard success response.
 */
function ok(res, data, meta) {
  return res.status(200).json({ status: 'ok', data, meta });
}

/**
 * Created response (201)
 */
function created(res, data) {
  return res.status(201).json({ status: 'ok', data });
}

/**
 * No content (204)
 */
function noContent(res) {
  return res.status(204).send();
}

/**
 * Error helpers
 */
function badRequest(res, message = 'Bad Request') {
  return res.status(400).json({ status: 'error', message });
}
function unauthorized(res, message = 'Unauthorized') {
  return res.status(401).json({ status: 'error', message });
}
function forbidden(res, message = 'Forbidden') {
  return res.status(403).json({ status: 'error', message });
}
function notFound(res, message = 'Not Found') {
  return res.status(404).json({ status: 'error', message });
}

module.exports = { ok, created, noContent, badRequest, unauthorized, forbidden, notFound };

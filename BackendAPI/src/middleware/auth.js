'use strict';
const { verifyJwt } = require('../utils/security');
const { unauthorized, forbidden } = require('../utils/http');

/**
 * PUBLIC_INTERFACE
 * Authenticate using Bearer token and attach user payload to req.user.
 * Returns 401 if invalid or missing token.
 */
function authenticate(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) return unauthorized(res, 'Missing Bearer token');

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    return next();
  } catch (e) {
    return unauthorized(res, 'Invalid or expired token');
  }
}

/**
 * PUBLIC_INTERFACE
 * Authorize roles
 * @param {string[]} roles
 */
function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    if (roles.length && !roles.includes(req.user.role)) {
      return forbidden(res);
    }
    next();
  };
}

module.exports = { authenticate, authorize };

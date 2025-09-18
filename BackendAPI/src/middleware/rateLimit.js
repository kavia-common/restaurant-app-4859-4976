'use strict';
const rateLimit = require('express-rate-limit');

/**
 * Global rate limiter for API.
 * Adjust windowMs and max based on deployment requirements.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stricter limiter for auth endpoints.
 */
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter };

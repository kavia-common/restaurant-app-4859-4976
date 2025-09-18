'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

/**
 * Create a JWT for a given user payload.
 * @param {{id:string,email:string,role:string}} payload
 * @returns {string}
 */
function signJwt(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

/**
 * Verify a JWT and return the decoded payload.
 * @param {string} token
 * @returns {object}
 */
function verifyJwt(token) {
  return jwt.verify(token, config.jwtSecret);
}

/**
 * Hash password
 * @param {string} password
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(config.passwordSaltRounds);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password to hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  signJwt,
  verifyJwt,
  hashPassword,
  comparePassword,
};

'use strict';
const authService = require('../services/auth');
const { ok, created, badRequest } = require('../utils/http');

class AuthController {
  /**
   * PUBLIC_INTERFACE
   * Register a user account.
   */
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      return created(res, user);
    } catch (e) {
      return badRequest(res, e.message);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Standard login.
   */
  async login(req, res) {
    try {
      const data = await authService.login(req.body);
      return ok(res, data);
    } catch (e) {
      return badRequest(res, e.message);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Social login (stub).
   */
  async social(req, res) {
    try {
      const data = await authService.socialLogin(req.body);
      return ok(res, data);
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
}

module.exports = new AuthController();

'use strict';
const loyaltyService = require('../services/loyalty');
const { ok, badRequest } = require('../utils/http');

class LoyaltyController {
  async me(req, res) {
    return ok(res, loyaltyService.getForUser(req.user.id));
  }
  async add(req, res) {
    try {
      const { delta, reason } = req.body;
      return ok(res, loyaltyService.addPoints(req.user.id, Number(delta || 0), reason || 'manual'));
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
}

module.exports = new LoyaltyController();

'use strict';
const paymentsService = require('../services/payments');
const { ok, created, badRequest } = require('../utils/http');

class PaymentsController {
  // PUBLIC_INTERFACE
  async intent(req, res) {
    try {
      const result = await paymentsService.createIntent(req.body);
      return created(res, result);
    } catch (e) {
      return badRequest(res, e.message);
    }
  }

  // PUBLIC_INTERFACE
  async confirm(req, res) {
    try {
      const result = await paymentsService.confirm(req.body);
      return ok(res, result);
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
}

module.exports = new PaymentsController();

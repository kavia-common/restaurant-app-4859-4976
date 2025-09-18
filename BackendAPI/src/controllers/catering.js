'use strict';
const cateringService = require('../services/catering');
const { ok, created, badRequest, notFound } = require('../utils/http');

class CateringController {
  async request(req, res) {
    try {
      return created(res, cateringService.request(req.user.id, req.body));
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
  async list(req, res) {
    return ok(res, cateringService.list(req.user.id));
  }
  async updateStatus(req, res) {
    try {
      return ok(res, cateringService.updateStatus(req.params.id, req.body.status));
    } catch (e) {
      return notFound(res, e.message);
    }
  }
}

module.exports = new CateringController();

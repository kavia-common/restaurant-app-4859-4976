'use strict';
const reservationsService = require('../services/reservations');
const { ok, created, badRequest, notFound } = require('../utils/http');

class ReservationsController {
  async create(req, res) {
    try {
      return created(res, reservationsService.create(req.user.id, req.body));
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
  async list(req, res) {
    return ok(res, reservationsService.list(req.user.id));
  }
  async updateStatus(req, res) {
    try {
      return ok(res, reservationsService.updateStatus(req.params.id, req.body.status));
    } catch (e) {
      return notFound(res, e.message);
    }
  }
}

module.exports = new ReservationsController();

'use strict';
const notificationsService = require('../services/notifications');
const { ok, created, badRequest } = require('../utils/http');

class NotificationsController {
  async send(req, res) {
    try {
      const result = await notificationsService.send(req.user.id, req.body);
      return created(res, result);
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
  async list(req, res) {
    return ok(res, notificationsService.list(req.user.id));
  }
}

module.exports = new NotificationsController();

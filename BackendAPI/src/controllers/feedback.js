'use strict';
const feedbackService = require('../services/feedback');
const { ok, created, badRequest } = require('../utils/http');

class FeedbackController {
  async submit(req, res) {
    try {
      return created(res, feedbackService.submit(req.user.id, req.body));
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
  async list(req, res) {
    return ok(res, feedbackService.list());
  }
}

module.exports = new FeedbackController();

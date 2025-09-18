'use strict';
const analyticsService = require('../services/analytics');
const { ok } = require('../utils/http');

class AnalyticsController {
  async snapshot(req, res) {
    return ok(res, analyticsService.snapshot());
  }
}

module.exports = new AnalyticsController();

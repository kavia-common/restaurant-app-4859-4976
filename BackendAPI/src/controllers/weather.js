'use strict';
const weatherService = require('../services/weather');
const { ok, badRequest } = require('../utils/http');

class WeatherController {
  async recommend(req, res) {
    try {
      const lat = Number(req.query.lat || 0);
      const lon = Number(req.query.lon || 0);
      const data = await weatherService.recommend({ lat, lon });
      return ok(res, data);
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
}

module.exports = new WeatherController();

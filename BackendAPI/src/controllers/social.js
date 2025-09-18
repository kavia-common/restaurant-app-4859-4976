'use strict';
const socialService = require('../services/social');
const { ok } = require('../utils/http');

class SocialController {
  async instagram(req, res) {
    const data = await socialService.instagramFeed();
    return ok(res, data);
  }
  async share(req, res) {
    const { type, id } = req.params;
    return ok(res, socialService.shareLink(type, id));
  }
}

module.exports = new SocialController();

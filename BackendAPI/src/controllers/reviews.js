'use strict';
const reviewsService = require('../services/reviews');
const { ok, created, badRequest, notFound } = require('../utils/http');

class ReviewsController {
  async create(req, res) {
    try {
      return created(res, reviewsService.create(req.user.id, req.body));
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
  async list(req, res) {
    return ok(res, reviewsService.list({ orderId: req.query.orderId }));
  }
  async approve(req, res) {
    try {
      return ok(res, reviewsService.approve(req.params.id));
    } catch (e) {
      return notFound(res, e.message);
    }
  }
  async feature(req, res) {
    try {
      return ok(res, reviewsService.setFeatured(req.params.id, req.body.featured));
    } catch (e) {
      return notFound(res, e.message);
    }
  }
  async analytics(req, res) {
    return ok(res, reviewsService.analytics());
  }
  async featured(req, res) {
    return ok(res, reviewsService.featured());
  }
}

module.exports = new ReviewsController();

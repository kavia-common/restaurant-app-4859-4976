'use strict';
const ordersService = require('../services/orders');
const { ok, created, badRequest, notFound } = require('../utils/http');

class OrdersController {
  async create(req, res) {
    try {
      const order = ordersService.createOrder(req.user.id, req.body);
      return created(res, order);
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
  async list(req, res) {
    return ok(res, ordersService.listOrders(req.user.id));
  }
  async get(req, res) {
    try {
      return ok(res, ordersService.getOrder(req.user.id, req.params.id));
    } catch (e) {
      return notFound(res, e.message);
    }
  }
  async updateStatus(req, res) {
    try {
      const order = ordersService.updateStatus(req.params.id, req.body.status);
      return ok(res, order);
    } catch (e) {
      return notFound(res, e.message);
    }
  }
}

module.exports = new OrdersController();

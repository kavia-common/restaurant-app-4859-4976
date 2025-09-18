'use strict';
const menuService = require('../services/menu');
const { ok, created, noContent, badRequest, notFound } = require('../utils/http');

class MenuController {
  async listCategories(req, res) {
    return ok(res, menuService.listCategories());
  }
  async createCategory(req, res) {
    try {
      return created(res, menuService.createCategory(req.body));
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
  async updateCategory(req, res) {
    try {
      return ok(res, menuService.updateCategory(req.params.id, req.body));
    } catch (e) {
      return notFound(res, e.message);
    }
  }
  async deleteCategory(req, res) {
    try {
      menuService.deleteCategory(req.params.id);
      return noContent(res);
    } catch (e) {
      return notFound(res, e.message);
    }
  }

  async listItems(req, res) {
    return ok(res, menuService.listItems({ categoryId: req.query.categoryId }));
  }
  async getItem(req, res) {
    try {
      return ok(res, menuService.getItem(req.params.id));
    } catch (e) {
      return notFound(res, e.message);
    }
  }
  async createItem(req, res) {
    try {
      return created(res, menuService.createItem(req.body));
    } catch (e) {
      return badRequest(res, e.message);
    }
  }
  async updateItem(req, res) {
    try {
      return ok(res, menuService.updateItem(req.params.id, req.body));
    } catch (e) {
      return notFound(res, e.message);
    }
  }
  async deleteItem(req, res) {
    try {
      menuService.deleteItem(req.params.id);
      return noContent(res);
    } catch (e) {
      return notFound(res, e.message);
    }
  }
}

module.exports = new MenuController();

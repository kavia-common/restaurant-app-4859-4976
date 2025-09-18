'use strict';
const store = require('../models/datastore');
const { hashPassword } = require('../utils/security');
const { created, badRequest, forbidden } = require('../utils/http');

/**
 * DevController
 * Provides development utilities such as seeding an admin user.
 * Ensure this is protected and used only in non-production environments.
 */
class DevController {
  /**
   * PUBLIC_INTERFACE
   * Seed an admin user for testing RBAC-protected endpoints.
   * Header: X-Seed-Secret must match process.env.SEED_SECRET (if set).
   * Body: { email, password, name }
   */
  async seedAdmin(req, res) {
    const secret = process.env.SEED_SECRET || 'allow-seed-in-dev';
    const provided = req.get('X-Seed-Secret');
    if (process.env.NODE_ENV === 'production' || provided !== secret) {
      return forbidden(res, 'Seeding not allowed');
    }
    const { email, password, name } = req.body || {};
    if (!email || !password) return badRequest(res, 'email and password required');
    const exists = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return badRequest(res, 'User already exists');

    const passwordHash = await hashPassword(password);
    const user = {
      id: String(store._id ? store._id() : Date.now()),
      email,
      passwordHash,
      name: name || 'Admin',
      role: 'admin',
      points: 0,
      locale: 'en',
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    return created(res, { id: user.id, email: user.email, role: user.role });
  }
}

module.exports = new DevController();

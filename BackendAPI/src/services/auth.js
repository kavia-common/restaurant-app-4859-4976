'use strict';
const store = require('../models/datastore');
const { signJwt, hashPassword, comparePassword } = require('../utils/security');

function sanitize(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

class AuthService {
  /**
   * PUBLIC_INTERFACE
   * Register a user
   */
  async register({ email, password, name, locale }) {
    const exists = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('Email already registered');
    const passwordHash = await hashPassword(password);
    const user = {
      id: String(store._id ? store._id() : Date.now()),
      email,
      passwordHash,
      name: name || email.split('@')[0],
      role: 'customer',
      points: 0,
      locale: locale || 'en',
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    return sanitize(user);
  }

  /**
   * PUBLIC_INTERFACE
   * Login with email/password
   */
  async login({ email, password }) {
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('Invalid credentials');
    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    return { token, user: sanitize(user) };
  }

  /**
   * PUBLIC_INTERFACE
   * Social login stub. In real integration, verify provider token.
   */
  async socialLogin({ provider, accessToken, email, name }) {
    if (!['google', 'apple'].includes(provider)) throw new Error('Unsupported provider');
    // In production, verify accessToken with provider SDK; here we trust input for dev
    let user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      user = {
        id: String(store._id ? store._id() : Date.now()),
        email,
        passwordHash: '',
        name: name || email,
        role: 'customer',
        points: 0,
        locale: 'en',
        createdAt: new Date().toISOString(),
      };
      store.users.push(user);
    }
    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    return { token, user: sanitize(user) };
  }
}

module.exports = new AuthService();

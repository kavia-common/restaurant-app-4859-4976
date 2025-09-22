import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';

export const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Email/password login
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Token and user info
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const { rows } = await query('SELECT id, name, email, password_hash FROM app_user WHERE email=$1', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: u.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: u.id, name: u.name, email: u.email } });
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * /auth/social:
 *   post:
 *     tags: [Auth]
 *     summary: Social login with provider access token (mock verification)
 */
router.post('/social', async (req, res, next) => {
  try {
    const { provider, accessToken } = req.body || {};
    if (!provider || !accessToken) return res.status(400).json({ error: 'Invalid request' });
    // For demo, trust access token and map to user 1
    const { rows } = await query('SELECT id, name, email FROM app_user ORDER BY id LIMIT 1');
    const u = rows[0];
    const token = jwt.sign({ sub: u.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: u });
  } catch (e) {
    next(e);
  }
});

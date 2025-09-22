import express from 'express';
import { query } from '../db.js';

export const router = express.Router();

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get latest messages/announcements
 */
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT title, body, created_at FROM notification ORDER BY created_at DESC LIMIT 20');
    res.json({ messages: rows });
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * /notifications/opt:
 *   post:
 *     tags: [Notifications]
 *     summary: Set opt-in preference (no-op demo)
 */
router.post('/opt', async (req, res, next) => {
  try {
    const { optIn } = req.body || {};
    // In production, save per-user preference
    res.json({ ok: true, optIn: !!optIn });
  } catch (e) {
    next(e);
  }
});

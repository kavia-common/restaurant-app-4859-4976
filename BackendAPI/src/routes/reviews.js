import express from 'express';
import { query } from '../db.js';

export const router = express.Router();

/**
 * @openapi
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get aggregates and latest reviews
 */
router.get('/', async (req, res, next) => {
  try {
    const avg = await query('SELECT COALESCE(AVG(rating),0) AS avg, COUNT(*) AS cnt FROM review');
    const latest = await query(
      'SELECT id, order_id AS "orderId", rating, comment, photo_url AS "photoUrl", created_at AS "createdAt" FROM review ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ average: Number(avg.rows[0].avg), count: Number(avg.rows[0].cnt), reviews: latest.rows });
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a review
 */
router.post('/', async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body || {};
    if (![4,5].includes(Number(rating))) return res.status(400).json({ error: 'Rating must be 4 or 5' });
    await query('INSERT INTO review (order_id, rating, comment) VALUES ($1,$2,$3)', [orderId || null, rating, comment || '']);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

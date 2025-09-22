import express from 'express';
import { query } from '../db.js';

export const router = express.Router();

/**
 * @openapi
 * /loyalty:
 *   get:
 *     tags: [Loyalty]
 *     summary: Get loyalty points and promotions
 */
router.get('/', async (req, res, next) => {
  try {
    const pointsRes = await query('SELECT COALESCE(SUM(points),0) AS pts FROM loyalty_transaction');
    const promos = await query('SELECT title, description FROM promotion WHERE active=true ORDER BY sort_order, id DESC');
    res.json({ points: Number(pointsRes.rows[0].pts), promotions: promos.rows });
  } catch (e) {
    next(e);
  }
});

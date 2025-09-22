import express from 'express';
import { v4 as uuid } from 'uuid';
import { query } from '../db.js';

export const router = express.Router();

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Place an order
 */
router.post('/', async (req, res, next) => {
  try {
    const { items, fulfillment, paymentMethod } = req.body || {};
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'No items' });
    const id = uuid();
    // Calculate total from DB prices for integrity
    let total = 0;
    for (const it of items) {
      const priceRes = await query(
        'SELECT price_lkr FROM menu_price WHERE menu_item_id=$1 AND portion=$2 LIMIT 1',
        [it.itemId, it.portion]
      );
      const price = priceRes.rows[0]?.price_lkr || 0;
      total += price * (it.quantity || 1);
    }
    const inserted = await query(
      'INSERT INTO app_order (id, status, fulfillment, total_lkr) VALUES ($1,$2,$3,$4) RETURNING created_at',
      [id, 'pending', fulfillment || 'pickup', total]
    );
    for (const it of items) {
      await query(
        `INSERT INTO order_item (order_id, menu_item_id, portion, quantity, spice, add_ons)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [id, it.itemId, it.portion, it.quantity || 1, it.spice || null, JSON.stringify(it.addOns || [])]
      );
    }
    res.json({ id, status: 'pending', createdAt: inserted.rows[0].created_at, total });
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT id, status, fulfillment, total_lkr FROM app_order WHERE id=$1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const o = rows[0];
    // Basic status simulation: progress over time
    const items = await query('SELECT COUNT(*) AS c FROM order_item WHERE order_id=$1', [id]);
    const itemCount = Number(items.rows[0].c);
    const status = itemCount > 0 ? o.status : 'pending';
    res.json({ id: o.id, status, fulfillment: o.fulfillment, total: o.total_lkr });
  } catch (e) {
    next(e);
  }
});

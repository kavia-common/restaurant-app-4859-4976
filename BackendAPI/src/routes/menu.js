import express from 'express';
import { query } from '../db.js';

export const router = express.Router();

/**
 * @openapi
 * /menu:
 *   get:
 *     tags: [Menu]
 *     summary: Get categories and items
 */
router.get('/', async (req, res, next) => {
  try {
    const cats = await query('SELECT id, name, description, image_url AS "imageUrl" FROM category ORDER BY sort_order, name');
    const items = await query(`
      SELECT 
        mi.id,
        mi.category_id AS "categoryId",
        mi.name,
        mi.description,
        COALESCE(mi.ingredients, '[]')::json AS ingredients,
        COALESCE(mi.allergens, '[]')::json AS allergens,
        mi.spice_level AS "spiceLevel",
        mi.image_url AS "imageUrl",
        COALESCE(mi.nutrition, '{}')::json AS nutrition,
        COALESCE(
          json_object_agg(mp.portion, mp.price_lkr) FILTER (WHERE mp.portion IS NOT NULL),
          '{}'::json
        ) AS "pricesByPortion"
      FROM menu_item mi
      LEFT JOIN menu_price mp ON mp.menu_item_id = mi.id
      GROUP BY mi.id
      ORDER BY mi.name
    `);
    res.json({ categories: cats.rows, items: items.rows });
  } catch (e) {
    next(e);
  }
});

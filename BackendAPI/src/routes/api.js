'use strict';
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const AuthController = require('../controllers/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimit');
const MenuController = require('../controllers/menu');
const OrdersController = require('../controllers/orders');
const ReservationsController = require('../controllers/reservations');
const ReviewsController = require('../controllers/reviews');
const LoyaltyController = require('../controllers/loyalty');
const NotificationsController = require('../controllers/notifications');
const AnalyticsController = require('../controllers/analytics');
const FeedbackController = require('../controllers/feedback');
const CateringController = require('../controllers/catering');
const SocialController = require('../controllers/social');
const WeatherController = require('../controllers/weather');
const PaymentsController = require('../controllers/payments');
const DevController = require('../controllers/dev');
const RealtimeController = require('../controllers/realtime');

const auth = new AuthController();
const menu = new MenuController();
const orders = new OrdersController();
const reservations = new ReservationsController();
const reviews = new ReviewsController();
const loyalty = new LoyaltyController();
const notifications = new NotificationsController();
const analytics = new AnalyticsController();
const feedback = new FeedbackController();
const catering = new CateringController();
const social = new SocialController();
const weather = new WeatherController();
const payments = new PaymentsController();
const dev = new DevController();
const realtime = new RealtimeController();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *   - name: Menu
 *   - name: Orders
 *   - name: Reservations
 *   - name: Reviews
 *   - name: Loyalty
 *   - name: Notifications
 *   - name: Analytics
 *   - name: Feedback
 *   - name: Catering
 *   - name: Social
 *   - name: Weather
 *   - name: Payments
 *   - name: Dev
 *   - name: Realtime
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/auth/register',
  authLimiter,
  validate({
    required: ['email', 'password'],
    types: { email: 'string', password: 'string', name: 'string', locale: 'string' }
  }),
  (req, res) => auth.register(req, res)
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
  '/auth/login',
  authLimiter,
  validate({ required: ['email', 'password'], types: { email: 'string', password: 'string' } }),
  (req, res) => auth.login(req, res)
);
/**
 * @swagger
 * /api/auth/social:
 *   post:
 *     summary: Social login (stub - validate via provider in production)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
  '/auth/social',
  authLimiter,
  validate({
    required: ['provider', 'accessToken', 'email'],
    types: { provider: 'string', accessToken: 'string', email: 'string', name: 'string' },
    enums: { provider: ['google', 'apple'] }
  }),
  (req, res) => auth.social(req, res)
);

// Menu
router.get('/menu/categories', (req, res) => menu.listCategories(req, res));
router.post('/menu/categories', authenticate, authorize(['admin', 'staff']), (req, res) => menu.createCategory(req, res));
router.put('/menu/categories/:id', authenticate, authorize(['admin', 'staff']), (req, res) => menu.updateCategory(req, res));
router.delete('/menu/categories/:id', authenticate, authorize(['admin']), (req, res) => menu.deleteCategory(req, res));

/**
 * @swagger
 * /api/menu/items:
 *   get:
 *     summary: List menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/menu/items', (req, res) => menu.listItems(req, res));
router.get('/menu/items/:id', (req, res) => menu.getItem(req, res));
router.post('/menu/items', authenticate, authorize(['admin', 'staff']), (req, res) => menu.createItem(req, res));
router.put('/menu/items/:id', authenticate, authorize(['admin', 'staff']), (req, res) => menu.updateItem(req, res));
router.delete('/menu/items/:id', authenticate, authorize(['admin']), (req, res) => menu.deleteItem(req, res));

// Orders
router.post(
  '/orders',
  authenticate,
  validate({
    required: ['items'],
    types: { items: 'object' }
  }),
  (req, res) => orders.create(req, res)
);
router.get('/orders', authenticate, (req, res) => orders.list(req, res));
router.get('/orders/:id', authenticate, (req, res) => orders.get(req, res));
router.patch('/orders/:id/status', authenticate, authorize(['admin', 'staff']), (req, res) => orders.updateStatus(req, res));

// Reservations
router.post(
  '/reservations',
  authenticate,
  validate({
    required: ['datetime', 'partySize'],
    types: { datetime: 'string', partySize: 'number', notes: 'string' }
  }),
  (req, res) => reservations.create(req, res)
);
router.get('/reservations', authenticate, (req, res) => reservations.list(req, res));
router.patch('/reservations/:id/status', authenticate, authorize(['admin', 'staff']), (req, res) => reservations.updateStatus(req, res));

// Reviews
router.post('/reviews', authenticate, (req, res) => reviews.create(req, res));
router.get('/reviews', (req, res) => reviews.list(req, res));
router.patch('/reviews/:id/approve', authenticate, authorize(['admin', 'staff']), (req, res) => reviews.approve(req, res));
router.patch('/reviews/:id/feature', authenticate, authorize(['admin', 'staff']), (req, res) => reviews.feature(req, res));
router.get('/reviews/analytics/summary', (req, res) => reviews.analytics(req, res));
router.get('/reviews/featured', (req, res) => reviews.featured(req, res));

// Loyalty
router.get('/loyalty/me', authenticate, (req, res) => loyalty.me(req, res));
router.post('/loyalty/points', authenticate, (req, res) => loyalty.add(req, res));

// Notifications
router.post('/notifications/send', authenticate, (req, res) => notifications.send(req, res));
router.get('/notifications', authenticate, (req, res) => notifications.list(req, res));

// Analytics
router.get('/analytics/snapshot', authenticate, authorize(['admin', 'staff']), (req, res) => analytics.snapshot(req, res));

// Feedback
router.post('/feedback', authenticate, (req, res) => feedback.submit(req, res));
router.get('/feedback', authenticate, authorize(['admin', 'staff']), (req, res) => feedback.list(req, res));

// Catering
router.post('/catering', authenticate, (req, res) => catering.request(req, res));
router.get('/catering', authenticate, (req, res) => catering.list(req, res));
router.patch('/catering/:id/status', authenticate, authorize(['admin', 'staff']), (req, res) => catering.updateStatus(req, res));

// Social
router.get('/social/instagram', (req, res) => social.instagram(req, res));
router.get('/social/share/:type/:id', (req, res) => social.share(req, res));

// Weather
router.get('/weather/recommendations', (req, res) => weather.recommend(req, res));

// Payments
/**
 * @swagger
 * /api/payments/intent:
 *   post:
 *     summary: Create a payment intent (stub)
 *     tags: [Payments]
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * @swagger
 * /api/payments/intent:
 *   post:
 *     summary: Create a payment intent (stub)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/payments/intent',
  validate({
    required: ['amountLKR', 'method'],
    types: { amountLKR: 'number', method: 'string' },
    enums: { method: ['cod', 'card', 'wallet'] }
  }),
  (req, res) => payments.intent(req, res)
);
/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm a payment (stub)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: OK
 */
// Dev utilities (non-production)
router.post('/dev/seed-admin', (req, res) => dev.seedAdmin(req, res));

// Realtime (SSE)
router.get('/realtime/orders', (req, res) => realtime.subscribeOrders(req, res));
/**
 * @swagger
 * /api/realtime/docs:
 *   get:
 *     summary: SSE usage docs for real-time order updates
 *     tags: [Realtime]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/realtime/docs', (req, res) => realtime.docs(req, res));

module.exports = router;

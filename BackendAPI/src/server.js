import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { router as authRoutes } from './routes/auth.js';
import { router as menuRoutes } from './routes/menu.js';
import { router as orderRoutes } from './routes/orders.js';
import { router as reviewRoutes } from './routes/reviews.js';
import { router as loyaltyRoutes } from './routes/loyalty.js';
import { router as notificationRoutes } from './routes/notifications.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3010;

app.use(express.json({ limit: '2mb' }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  })
);
app.use(rateLimit({ windowMs: 60 * 1000, limit: 120 }));

// OpenAPI
const openapiSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Backend API',
      version: '1.0.0',
      description:
        'API for restaurant app including auth, menu, orders, payments, reviews, loyalty, and notifications.',
    },
    servers: [{ url: `http://localhost:${port}` }],
    tags: [
      { name: 'Auth', description: 'Authentication and user accounts' },
      { name: 'Menu', description: 'Menu browsing and management' },
      { name: 'Orders', description: 'Order placement and tracking' },
      { name: 'Reviews', description: 'Customer reviews' },
      { name: 'Loyalty', description: 'Loyalty program and promotions' },
      { name: 'Notifications', description: 'Push notification preferences' }
    ],
  },
  apis: ['./src/routes/*.js'],
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/', (_, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/loyalty', loyaltyRoutes);
app.use('/notifications', notificationRoutes);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend API running at http://localhost:${port}`);
  console.log(`API docs: http://localhost:${port}/docs`);
});

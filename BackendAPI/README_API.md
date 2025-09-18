# Restaurant Backend API

This Express.js BackendAPI container implements core endpoints required by the mobile frontend:
- Auth: email/password and social login (stubs)
- Menu: categories and items with ingredients, allergens, nutrition, spice levels, and portions with dynamic pricing in LKR
- Orders: cart-based order creation, history, and real-time status updates (admin/staff only)
- Reservations: request and status management
- Reviews: 4-5 star ratings with comments, photo uploads (URL list), moderation and featured testimonials, analytics
- Loyalty: points tracking and history
- Notifications: push notifications (stubbed audit)
- Analytics: snapshot dashboard
- Feedback: direct messages to management
- Catering: bulk order requests
- Social: Instagram feed (stub) and share links
- Weather: weather-based recommendations (stub)

Run dev:
- cp .env.example .env
- npm install
- npm run dev
- API at: http://localhost:3000/api
- Docs at: http://localhost:3000/docs

Seed admin (development only):
- Set SEED_SECRET in your .env (defaults to allow-seed-in-dev)
- POST http://localhost:3000/api/dev/seed-admin
  Headers: X-Seed-Secret: <SEED_SECRET>
  Body: { "email": "admin@example.com", "password": "ChangeMe123!", "name": "Admin" }

Security and compliance:
- Use JWT (Authorization: Bearer <token>)
- Role-based access: admin/staff/customer
- Helmet for security headers
- Basic rate limiting via express-rate-limit
- Minimal request validation middleware (replace with zod/joi in production)
- Environment-driven configuration
- Data currently in-memory (not persistent). Replace with DB integration when ApplicationDatabase is ready.

OpenAPI:
- Generated from JSDoc annotations; visit /docs
- Export JSON: node generate_openapi.js (outputs to BackendAPI/interfaces/openapi.json)
- Tags include: Health, Auth, Menu, Orders, Reservations, Reviews, Loyalty, Notifications, Analytics, Feedback, Catering, Social, Weather, Payments, Dev

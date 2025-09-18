'use strict';
require('dotenv').config();

/**
 * Application configuration loaded from environment.
 * IMPORTANT: Do not hardcode secrets; use environment variables.
 * For local development, create a .env file based on .env.example in the container root.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',

  // JWT and auth
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10),

  // Social login providers (stubs)
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  appleClientId: process.env.APPLE_CLIENT_ID || '',
  appleTeamId: process.env.APPLE_TEAM_ID || '',
  appleKeyId: process.env.APPLE_KEY_ID || '',
  applePrivateKey: process.env.APPLE_PRIVATE_KEY || '',

  // Payments (stubs)
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',

  // Notifications (stubs)
  fcmServerKey: process.env.FCM_SERVER_KEY || '',

  // Instagram / social (stubs)
  instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',

  // Weather (stubs)
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  weatherApiBaseUrl: process.env.WEATHER_API_BASE_URL || 'https://api.open-meteo.com/v1/forecast',

  // Site URL for deep links and email redirects
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',

  // Data store mode: memory (default) until database container integrated
  datastore: process.env.DATASTORE || 'memory',
};

module.exports = config;

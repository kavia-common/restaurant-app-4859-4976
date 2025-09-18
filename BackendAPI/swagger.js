const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Backend API',
      version: '1.0.0',
      description: 'Backend API for restaurant mobile app (auth, menu, orders, reservations, reviews, loyalty, notifications, analytics, social, weather).',
    },
    tags: [
      { name: 'Health' }, { name: 'Auth' }, { name: 'Menu' }, { name: 'Orders' }, { name: 'Reservations' },
      { name: 'Reviews' }, { name: 'Loyalty' }, { name: 'Notifications' }, { name: 'Analytics' },
      { name: 'Feedback' }, { name: 'Catering' }, { name: 'Social' }, { name: 'Weather' },
      { name: 'Payments' }, { name: 'Dev' }, { name: 'Realtime' }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

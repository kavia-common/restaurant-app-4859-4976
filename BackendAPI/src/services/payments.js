'use strict';
const config = require('../config');

/**
 * PaymentsService provides stubs for multiple payment methods such as cards, wallets, and cash-on-delivery.
 * Replace with real gateway integrations (e.g., Stripe, Razorpay) and add webhook validation when credentials are available.
 */
class PaymentsService {
  // PUBLIC_INTERFACE
  async createIntent({ amountLKR, currency = 'LKR', method = 'cod', metadata = {} }) {
    // Stub: For online payments, call gateway to create a payment intent/session
    if (method === 'cod') {
      return { id: String(Date.now()), status: 'PENDING', method, currency, amountLKR, metadata, provider: 'offline' };
    }
    if (!config.stripeSecretKey && !config.razorpayKeyId) {
      return { id: String(Date.now()), status: 'REQUIRES_PROVIDER_CONFIG', method, currency, amountLKR, metadata };
    }
    // Return a mock online payment intent
    return { id: `mock_${Date.now()}`, status: 'REQUIRES_ACTION', method, currency, amountLKR, metadata, clientSecret: 'mock_secret' };
  }

  // PUBLIC_INTERFACE
  async confirm({ paymentId }) {
    // Stub confirmation
    return { id: paymentId, status: 'SUCCEEDED' };
  }
}

module.exports = new PaymentsService();

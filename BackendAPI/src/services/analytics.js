'use strict';
const store = require('../models/datastore');

class AnalyticsService {
  // PUBLIC_INTERFACE
  snapshot() {
    const totalOrders = store.orders.length;
    const revenue = store.orders.reduce((s, o) => s + (o.totalLKR || 0), 0);
    const popularItems = {};
    store.orders.forEach(o => o.items.forEach(oi => {
      popularItems[oi.itemId] = (popularItems[oi.itemId] || 0) + oi.quantity;
    }));
    const popular = Object.entries(popularItems).sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([itemId, qty]) => ({ itemId, quantity: qty }));
    const users = store.users.length;
    return { totalOrders, revenue, popular, users };
  }
}

module.exports = new AnalyticsService();

'use strict';
const store = require('../models/datastore');

class LoyaltyService {
  // PUBLIC_INTERFACE
  getForUser(userId) {
    let entry = store.loyalty.find(l => l.userId === userId);
    if (!entry) {
      entry = { userId, points: 0, history: [] };
      store.loyalty.push(entry);
    }
    return entry;
  }

  // PUBLIC_INTERFACE
  addPoints(userId, delta, reason) {
    const entry = this.getForUser(userId);
    entry.points += delta;
    entry.history.push({ delta, reason, timestamp: new Date().toISOString() });
    return entry;
  }
}

module.exports = new LoyaltyService();

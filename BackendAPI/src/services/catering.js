'use strict';
const store = require('../models/datastore');

class CateringService {
  // PUBLIC_INTERFACE
  request(userId, payload) {
    const reqId = String(store._id ? store._id() : Date.now());
    const rec = {
      id: reqId,
      userId,
      eventDate: payload.eventDate,
      guestCount: payload.guestCount || 10,
      notes: payload.notes || '',
      items: payload.items || [],
      contact: payload.contact || {},
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };
    store.catering.push(rec);
    return rec;
  }
  // PUBLIC_INTERFACE
  list(userId) {
    return store.catering.filter(c => c.userId === userId);
  }
  // PUBLIC_INTERFACE
  updateStatus(id, status) {
    const rec = store.catering.find(c => c.id === id);
    if (!rec) throw new Error('Request not found');
    rec.status = status;
    return rec;
  }
}

module.exports = new CateringService();

'use strict';
const store = require('../models/datastore');

class ReservationsService {
  // PUBLIC_INTERFACE
  create(userId, payload) {
    const id = String(store._id ? store._id() : Date.now());
    const resv = {
      id,
      userId,
      datetime: payload.datetime,
      partySize: payload.partySize || 2,
      notes: payload.notes || '',
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };
    store.reservations.push(resv);
    return resv;
  }
  // PUBLIC_INTERFACE
  list(userId) {
    return store.reservations.filter(r => r.userId === userId);
  }
  // PUBLIC_INTERFACE
  updateStatus(id, status) {
    const r = store.reservations.find(rr => rr.id === id);
    if (!r) throw new Error('Reservation not found');
    r.status = status;
    return r;
  }
}

module.exports = new ReservationsService();

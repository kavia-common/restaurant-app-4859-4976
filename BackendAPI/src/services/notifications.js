'use strict';
const store = require('../models/datastore');

class NotificationsService {
  // PUBLIC_INTERFACE
  async send(userId, { title, body, data }) {
    // Stub: Push via FCM when configured. For now, log/audit.
    const record = { id: String(Date.now()), userId, title, body, data: data || {}, createdAt: new Date().toISOString() };
    store.notifications.push(record);
    return { success: true, id: record.id };
  }

  // PUBLIC_INTERFACE
  list(userId) {
    return store.notifications.filter(n => n.userId === userId);
  }
}

module.exports = new NotificationsService();

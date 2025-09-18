'use strict';
const store = require('../models/datastore');

class FeedbackService {
  // PUBLIC_INTERFACE
  submit(userId, payload) {
    const fb = {
      id: String(store._id ? store._id() : Date.now()),
      userId,
      subject: payload.subject || 'Feedback',
      message: payload.message,
      createdAt: new Date().toISOString(),
    };
    store.feedback.push(fb);
    return fb;
  }

  // PUBLIC_INTERFACE
  list() {
    return store.feedback.slice().reverse();
  }
}

module.exports = new FeedbackService();

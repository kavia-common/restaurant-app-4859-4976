'use strict';
const store = require('../models/datastore');

class ReviewsService {
  // PUBLIC_INTERFACE
  create(userId, payload) {
    const id = String(store._id ? store._id() : Date.now());
    const review = {
      id,
      userId,
      orderId: payload.orderId,
      rating: payload.rating,
      comment: payload.comment || '',
      photos: payload.photos || [],
      status: 'PENDING', // moderation stub
      createdAt: new Date().toISOString(),
      featured: false,
    };
    store.reviews.push(review);
    return review;
  }

  // PUBLIC_INTERFACE
  list({ orderId } = {}) {
    const arr = orderId ? store.reviews.filter(r => r.orderId === orderId) : store.reviews;
    return arr.filter(r => r.status === 'APPROVED' || r.status === 'PENDING'); // expose pending for dev
  }

  // PUBLIC_INTERFACE
  approve(id) {
    const r = store.reviews.find(rr => rr.id === id);
    if (!r) throw new Error('Review not found');
    r.status = 'APPROVED';
    return r;
  }

  // PUBLIC_INTERFACE
  setFeatured(id, featured) {
    const r = store.reviews.find(rr => rr.id === id);
    if (!r) throw new Error('Review not found');
    r.featured = !!featured;
    return r;
  }

  // PUBLIC_INTERFACE
  analytics() {
    const total = store.reviews.length;
    const approved = store.reviews.filter(r => r.status === 'APPROVED');
    const avg = approved.length ? approved.reduce((s, r) => s + (r.rating || 0), 0) / approved.length : 0;
    const byItem = {};
    store.orders.forEach(o => {
      const hasReview = store.reviews.find(r => r.orderId === o.id);
      if (hasReview) {
        o.items.forEach(oi => {
          byItem[oi.itemId] = (byItem[oi.itemId] || 0) + 1;
        });
      }
    });
    const mostReviewed = Object.entries(byItem).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([itemId, count]) => ({ itemId, count }));
    return { total, averageRating: Number(avg.toFixed(2)), mostReviewed };
  }

  // PUBLIC_INTERFACE
  featured() {
    return store.reviews.filter(r => r.featured && r.status === 'APPROVED');
  }
}

module.exports = new ReviewsService();

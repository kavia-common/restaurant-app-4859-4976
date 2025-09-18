'use strict';

/**
 * Minimal in-memory Pub/Sub for broadcasting server events (e.g., order status updates).
 * Not suitable for multi-instance deployments; replace with Redis or message broker for scale.
 */
class EventBus {
  constructor() {
    this.subscribers = new Map(); // channel -> Set<fn>
  }

  // PUBLIC_INTERFACE
  subscribe(channel, fn) {
    if (!this.subscribers.has(channel)) this.subscribers.set(channel, new Set());
    this.subscribers.get(channel).add(fn);
    return () => this.unsubscribe(channel, fn);
  }

  // PUBLIC_INTERFACE
  unsubscribe(channel, fn) {
    const set = this.subscribers.get(channel);
    if (!set) return;
    set.delete(fn);
  }

  // PUBLIC_INTERFACE
  publish(channel, payload) {
    const set = this.subscribers.get(channel);
    if (!set) return;
    for (const fn of set) {
      try { fn(payload); } catch (e) { /* noop */ }
    }
  }
}

module.exports = new EventBus();

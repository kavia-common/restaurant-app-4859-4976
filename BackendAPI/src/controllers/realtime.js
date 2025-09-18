'use strict';
const events = require('../utils/events');

/**
 * RealtimeController exposes Server-Sent Events (SSE) endpoints for real-time updates.
 * For production scale, replace with WebSockets + Redis adapter.
 */
class RealtimeController {
  /**
   * PUBLIC_INTERFACE
   * Subscribe to order status events (SSE).
   * Optional query: userId to filter events for a specific user.
   */
  subscribeOrders(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const userIdFilter = req.query.userId;
    const send = (evt) => {
      if (userIdFilter && String(evt.userId) !== String(userIdFilter)) return;
      res.write(`event: ${evt.type}\n`);
      res.write(`data: ${JSON.stringify(evt)}\n\n`);
    };

    // Send a ping to establish stream
    res.write('event: ping\ndata: {"ok":true}\n\n');

    const unsubscribe = events.subscribe('orders', send);

    req.on('close', () => {
      unsubscribe();
      try { res.end(); } catch (e) { /* ignore */ }
    });
  }

  /**
   * PUBLIC_INTERFACE
   * Returns documentation on how to connect to SSE for order updates.
   */
  docs(req, res) {
    return res.status(200).json({
      status: 'ok',
      data: {
        sseEndpoint: '/api/realtime/orders',
        exampleFetch: 'const es = new EventSource(\'/api/realtime/orders?userId=<USER_ID>\'); es.onmessage = (e)=>console.log(e.data);',
        events: ['order.created', 'order.status', 'ping'],
        note: 'This is a development-friendly SSE endpoint. For production, consider WebSockets and a shared event bus.',
      }
    });
  }
}

module.exports = new RealtimeController();

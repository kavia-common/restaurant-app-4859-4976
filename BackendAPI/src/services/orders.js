'use strict';
const store = require('../models/datastore');
const events = require('../utils/events');

function calcItemPrice(item, portion) {
  if (!item || !Array.isArray(item.portions)) return 0;
  const p = item.portions.find(pp => pp.size === portion);
  return p ? p.priceLKR : (item.portions[0]?.priceLKR || 0);
}

class OrdersService {
  // PUBLIC_INTERFACE
  createOrder(userId, payload) {
    const itemsDetailed = payload.items.map(ci => {
      const item = store.menuItems.find(i => i.id === ci.itemId);
      const unitPrice = calcItemPrice(item, ci.portion || 'normal');
      return { ...ci, priceLKR: unitPrice * (ci.quantity || 1) };
    });
    const totalLKR = itemsDetailed.reduce((sum, it) => sum + (it.priceLKR || 0), 0);
    const id = String(store._id ? store._id() : Date.now());
    const order = {
      id,
      userId,
      items: itemsDetailed,
      totalLKR,
      status: 'PLACED',
      fulfillment: payload.fulfillment || { type: 'pickup' },
      deliveryAddress: payload.deliveryAddress || null,
      createdAt: new Date().toISOString(),
      history: [{ status: 'PLACED', timestamp: new Date().toISOString() }],
      payment: { method: payload.paymentMethod || 'cod', status: 'PENDING' },
    };
    store.orders.push(order);
    // Broadcast creation event
    events.publish('orders', { type: 'order.created', orderId: id, userId, status: order.status, at: order.createdAt });
    return order;
  }

  // PUBLIC_INTERFACE
  listOrders(userId) {
    return store.orders.filter(o => o.userId === userId);
  }

  // PUBLIC_INTERFACE
  getOrder(userId, id) {
    const order = store.orders.find(o => o.id === id && o.userId === userId);
    if (!order) throw new Error('Order not found');
    return order;
  }

  // PUBLIC_INTERFACE
  updateStatus(id, status) {
    const order = store.orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    order.status = status;
    const ts = new Date().toISOString();
    order.history.push({ status, timestamp: ts });
    // Broadcast status update
    events.publish('orders', { type: 'order.status', orderId: id, status, at: ts });
    return order;
  }
}

module.exports = new OrdersService();

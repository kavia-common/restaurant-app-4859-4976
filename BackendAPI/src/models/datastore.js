'use strict';
const crypto = require('crypto');

/**
 * Simple in-memory data store used for development.
 * Replace with DB implementations (PostgreSQL) via a repository layer when ApplicationDatabase is ready.
 */
class MemoryStore {
  constructor() {
    this.users = []; // {id,email,passwordHash,name,role,points,locale,createdAt}
    this.sessions = []; // {token,userId,createdAt}
    this.menuCategories = []; // {id,name,description,order}
    this.menuItems = []; // {id,categoryId,name,description,ingredients,spiceLevel,images,allergens,nutrition,portions:[{size,priceLKR}],isAvailable}
    this.orders = []; // {id,userId,items:[{itemId,portion,addons,quantity,priceLKR}],totalLKR,status,fulfillment,deliveryAddress,createdAt,history:[{status,timestamp}]}
    this.reservations = []; // {id,userId,datetime,partySize,notes,status,createdAt}
    this.reviews = []; // {id,userId,orderId,rating,comment,photos,status,createdAt}
    this.loyalty = []; // {userId,points,history:[{delta,reason,timestamp}]}
    this.notifications = []; // audit log
    this.feedback = []; // {id,userId,message,subject,createdAt}
    this.catering = []; // {id,userId,eventDate,guestCount,notes,items,contact,status,createdAt}

    // Seed with a sample category and item
    const catId = this._id();
    const itemId = this._id();
    this.menuCategories.push({ id: catId, name: 'Traditional Rice & Curry', description: 'Authentic recipes', order: 1 });
    this.menuItems.push({
      id: itemId,
      categoryId: catId,
      name: 'Chicken Rice & Curry',
      description: 'Steamed rice with spiced chicken curry and sides.',
      ingredients: ['Rice', 'Chicken', 'Curry leaves', 'Spices'],
      spiceLevel: 'medium',
      images: [],
      allergens: ['dairy'],
      nutrition: { calories: 720 },
      portions: [
        { size: 'normal', priceLKR: 1200 },
        { size: 'full', priceLKR: 1900 }
      ],
      isAvailable: true,
    });
  }

  _id() {
    return crypto.randomBytes(8).toString('hex');
  }
}

module.exports = new MemoryStore();

'use strict';
const store = require('../models/datastore');

class MenuService {
  // PUBLIC_INTERFACE
  listCategories() {
    return store.menuCategories.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  // PUBLIC_INTERFACE
  createCategory(payload) {
    const id = String(store._id ? store._id() : Date.now());
    const cat = { id, name: payload.name, description: payload.description || '', order: payload.order || 0 };
    store.menuCategories.push(cat);
    return cat;
  }
  // PUBLIC_INTERFACE
  updateCategory(id, patch) {
    const cat = store.menuCategories.find(c => c.id === id);
    if (!cat) throw new Error('Category not found');
    Object.assign(cat, patch);
    return cat;
  }
  // PUBLIC_INTERFACE
  deleteCategory(id) {
    const idx = store.menuCategories.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    store.menuCategories.splice(idx, 1);
  }

  // PUBLIC_INTERFACE
  listItems({ categoryId } = {}) {
    const list = categoryId ? store.menuItems.filter(i => i.categoryId === categoryId) : store.menuItems;
    return list.filter(i => i.isAvailable !== false);
  }
  // PUBLIC_INTERFACE
  getItem(id) {
    const item = store.menuItems.find(i => i.id === id);
    if (!item) throw new Error('Item not found');
    return item;
  }
  // PUBLIC_INTERFACE
  createItem(payload) {
    const id = String(store._id ? store._id() : Date.now());
    const item = {
      id,
      categoryId: payload.categoryId,
      name: payload.name,
      description: payload.description || '',
      ingredients: payload.ingredients || [],
      spiceLevel: payload.spiceLevel || 'mild',
      images: payload.images || [],
      allergens: payload.allergens || [],
      nutrition: payload.nutrition || null,
      portions: payload.portions || [{ size: 'normal', priceLKR: payload.priceLKR || 0 }],
      isAvailable: payload.isAvailable !== false,
    };
    store.menuItems.push(item);
    return item;
  }
  // PUBLIC_INTERFACE
  updateItem(id, patch) {
    const item = store.menuItems.find(i => i.id === id);
    if (!item) throw new Error('Item not found');
    Object.assign(item, patch);
    return item;
  }
  // PUBLIC_INTERFACE
  deleteItem(id) {
    const idx = store.menuItems.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    store.menuItems.splice(idx, 1);
  }
}

module.exports = new MenuService();

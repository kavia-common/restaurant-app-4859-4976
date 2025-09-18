'use strict';
const store = require('../models/datastore');
const config = require('../config');

class WeatherService {
  // PUBLIC_INTERFACE
  async recommend({ lat, lon }) {
    // Stub: Normally fetch weather using config.weatherApiKey and base URL
    const isHot = true; // pretend hot day
    const candidates = store.menuItems.filter(i => i.isAvailable);
    const recommended = candidates.slice(0, 5).map(i => ({
      itemId: i.id,
      name: i.name,
      reason: isHot ? 'Hot day - refreshing items recommended' : 'Cool day - warming dishes recommended',
    }));
    return { source: config.weatherApiBaseUrl, recommended };
  }
}

module.exports = new WeatherService();

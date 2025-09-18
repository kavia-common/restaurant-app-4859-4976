'use strict';
const config = require('../config');

class SocialService {
  // PUBLIC_INTERFACE
  async instagramFeed() {
    // Stub: Normally call Instagram Graph API with access token
    if (!config.instagramAccessToken) {
      return { warning: 'INSTAGRAM_ACCESS_TOKEN not set; returning mock data', posts: [] };
    }
    // Return empty structure for now
    return { posts: [] };
  }

  // PUBLIC_INTERFACE
  shareLink(resourceType, resourceId) {
    // Generate a simple shareable link
    return { url: `${config.siteUrl}/share/${resourceType}/${resourceId}` };
  }
}

module.exports = new SocialService();

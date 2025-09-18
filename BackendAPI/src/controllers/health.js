const healthService = require('../services/health');

/**
 * HealthController provides the root health check.
 */
class HealthController {
  /**
   * PUBLIC_INTERFACE
   * Returns a health status object with environment and timestamp.
   */
  check(req, res) {
    const healthStatus = healthService.getStatus();
    return res.status(200).json(healthStatus);
  }
}

module.exports = new HealthController();

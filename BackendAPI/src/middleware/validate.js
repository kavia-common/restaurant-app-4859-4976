'use strict';

/**
 * Simple validation middleware factory.
 * Provide a schema object with keys: required (array), types (map field->typeof), enums (map field->[allowed])
 * This is intentionally minimal to avoid external deps. Replace with zod/joi for production.
 */
function validate(schema = {}) {
  return (req, res, next) => {
    const body = req.body || {};
    // required fields
    if (Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (body[field] === undefined || body[field] === null || body[field] === '') {
          return res.status(400).json({ status: 'error', message: `Field '${field}' is required` });
        }
      }
    }
    // type checks
    if (schema.types && typeof schema.types === 'object') {
      for (const [field, type] of Object.entries(schema.types)) {
        if (body[field] !== undefined && typeof body[field] !== type) {
          return res.status(400).json({ status: 'error', message: `Field '${field}' must be of type ${type}` });
        }
      }
    }
    // enums
    if (schema.enums && typeof schema.enums === 'object') {
      for (const [field, allowed] of Object.entries(schema.enums)) {
        if (body[field] !== undefined && !allowed.includes(body[field])) {
          return res.status(400).json({ status: 'error', message: `Field '${field}' must be one of: ${allowed.join(', ')}` });
        }
      }
    }
    next();
  };
}

module.exports = { validate };

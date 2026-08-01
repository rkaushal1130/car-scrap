const ApiError = require('../utils/apiError');

/**
 * Sliding Window Memory Rate Limiter implementation
 */
const createMemoryRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const maxRequests = options.max || 100; // 100 requests default
  const message = options.message || 'Too many requests from this IP. Please try again later.';

  const ipStore = new Map();

  // Periodically clean up expired IP entries every minute
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipStore.entries()) {
      if (now > data.resetTime) {
        ipStore.delete(ip);
      }
    }
  }, 60 * 1000);

  return (req, res, next) => {
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      'unknown-ip';

    const now = Date.now();
    let clientData = ipStore.get(clientIp);

    if (!clientData || now > clientData.resetTime) {
      clientData = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipStore.set(clientIp, clientData);
    } else {
      clientData.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader(
      'X-RateLimit-Remaining',
      Math.max(0, maxRequests - clientData.count)
    );
    res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000));

    if (clientData.count > maxRequests) {
      throw new ApiError(429, message);
    }

    next();
  };
};

const apiLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: 'General API rate limit exceeded. Please wait 15 minutes before making new requests.',
});

const authLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

const uploadLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Upload rate limit exceeded. Please wait 15 minutes before uploading more images.',
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  createMemoryRateLimiter,
};

const ApiError = require('../utils/apiError');

/**
 * In-memory sliding window rate limiter store
 */
class MemoryRateLimiter {
  constructor(windowMs = 15 * 60 * 1000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.hits = new Map();

    // Periodically clean up expired IP timestamps every minute
    setInterval(() => this.cleanup(), 60 * 1000).unref();
  }

  cleanup() {
    const now = Date.now();
    for (const [ip, timestamps] of this.hits.entries()) {
      const validTimestamps = timestamps.filter((time) => now - time < this.windowMs);
      if (validTimestamps.length > 0) {
        this.hits.set(ip, validTimestamps);
      } else {
        this.hits.delete(ip);
      }
    }
  }

  middleware(message = 'Too many requests from this IP. Please try again later.') {
    return (req, res, next) => {
      const ip =
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.connection?.remoteAddress ||
        req.ip ||
        '127.0.0.1';

      const now = Date.now();
      const userTimestamps = this.hits.get(ip) || [];

      // Filter timestamps within current window
      const validTimestamps = userTimestamps.filter((time) => now - time < this.windowMs);

      if (validTimestamps.length >= this.maxRequests) {
        const oldestTimestamp = validTimestamps[0];
        const resetTimeSeconds = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000);

        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', resetTimeSeconds);

        return next(
          new ApiError(
            429,
            `${message} Try again in ${resetTimeSeconds} second(s).`
          )
        );
      }

      validTimestamps.push(now);
      this.hits.set(ip, validTimestamps);

      const remaining = Math.max(0, this.maxRequests - validTimestamps.length);
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);

      next();
    };
  }
}

/**
 * Factory helper to create custom rate limiters
 */
const createRateLimiter = (options = {}) => {
  const { windowMs = 15 * 60 * 1000, max = 100, message } = options;
  const limiter = new MemoryRateLimiter(windowMs, max);
  return limiter.middleware(message);
};

// General API Rate Limiter (100 requests per 15 minutes)
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'General API rate limit exceeded.',
});

// Auth Endpoints Rate Limiter (10 requests per 15 minutes to prevent brute-force attacks)
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts.',
});

// File Upload Rate Limiter (20 uploads per 15 minutes)
const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many file uploads.',
});

module.exports = {
  createRateLimiter,
  apiLimiter,
  authLimiter,
  uploadLimiter,
};

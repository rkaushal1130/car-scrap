const morgan = require('morgan');

// Custom token for remote IP address
morgan.token('client-ip', (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
});

// Custom token for authenticated user ID if available
morgan.token('user-id', (req) => {
  return req.user ? req.user._id : 'Guest';
});

// Custom Morgan Format string
const morganFormat =
  process.env.NODE_ENV === 'production'
    ? ':client-ip - :user-id [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
    : ':method :url :status :response-time ms - :res[content-length] (User: :user-id)';

/**
 * Production Morgan HTTP Logging Middleware
 */
const httpLogger = morgan(morganFormat);

/**
 * Custom Request Logger Utility for debugging
 */
const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  }
  next();
};

module.exports = {
  httpLogger,
  requestLogger,
};

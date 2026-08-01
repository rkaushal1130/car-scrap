const morgan = require('morgan');

const httpLogger = morgan(
  process.env.NODE_ENV === 'production'
    ? 'combined'
    : ':method :url :status :res[content-length] - :response-time ms'
);

const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
};

module.exports = {
  httpLogger,
  requestLogger,
};

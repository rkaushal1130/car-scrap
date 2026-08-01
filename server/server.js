const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db.config');
const { getCorsOptions } = require('./config/security.config');
const apiRoutes = require('./routes/index');
const {
  httpLogger,
  apiLimiter,
  sanitizeRequest,
  notFoundHandler,
  errorHandler,
} = require('./middlewares');

// Initialize Express App
const app = express();

// Disable 'X-Powered-By' header to prevent technology stack disclosure
app.disable('x-powered-by');

// Connect Database
connectDB();

// Production Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", 'https://api.cloudinary.com'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Strict Production CORS Setup
app.use(cors(getCorsOptions()));

// HTTP Request Logging
app.use(httpLogger);

// Global Sliding Window Rate Limiter
app.use(apiLimiter);

// Body Parsers with payload size limits (16kb)
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Request Sanitizer against XSS & NoSQL Injection Attacks
app.use(sanitizeRequest);

// Root Health Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Car Scrap Enterprise Backend API Server is running securely!',
  });
});

// Mount API Version 1 Routes
app.use('/api/v1', apiRoutes);

// 404 Not Found Handler
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔒 Server running securely in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});



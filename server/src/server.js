const dotenv = require('dotenv');

// Load environment variables before initializing database and app
dotenv.config();

const connectDB = require('./database/db.config');
const app = require('./app');

// Connect to MongoDB Database
connectDB();

// Start HTTP Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🔒 Enterprise Server running securely in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Promise Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`💥 Uncaught Exception: ${err.message}`);
  process.exit(1);
});

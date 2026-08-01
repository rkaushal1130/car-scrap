const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car_scrap_db';

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== 'production', // Don't build indexes automatically in production
    });

    console.log(`🍃 MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failure: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection disconnected. Retrying...');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Runtime Error: ${err.message}`);
});

module.exports = connectDB;

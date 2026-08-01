const dotenv = require('dotenv');

dotenv.config();

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car_scrap_db',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_access_secret_key',
    expire: process.env.JWT_EXPIRE || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};

module.exports = env;

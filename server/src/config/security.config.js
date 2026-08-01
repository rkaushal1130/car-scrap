const getCorsOptions = () => {
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error(`CORS Access Denied: Origin '${origin}' is not authorized`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Set-Cookie', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400,
  };
};

const getCookieOptions = (overrideMaxAge = null) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: overrideMaxAge || 7 * 24 * 60 * 60 * 1000,
  };
};

const jwtConfig = {
  accessSecret: process.env.JWT_SECRET || 'fallback_access_secret_key_change_in_prod',
  accessExpiry: process.env.JWT_EXPIRE || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_change_in_prod',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRE || '7d',
};

module.exports = {
  getCorsOptions,
  getCookieOptions,
  jwtConfig,
};

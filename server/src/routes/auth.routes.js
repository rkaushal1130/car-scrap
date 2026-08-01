const express = require('express');
const router = express.Router();

const {
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} = require('../controllers/auth.controller');

const {
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  refreshTokenValidator,
} = require('../validators/auth.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

router.post('/login', authLimiter, loginValidator, validate, loginAdmin);
router.post('/refresh-token', refreshTokenValidator, validate, refreshAccessToken);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validate, resetPassword);

router.use(verifyJWT);
router.post('/logout', logoutAdmin);
router.get('/me', getCurrentUser);

module.exports = router;

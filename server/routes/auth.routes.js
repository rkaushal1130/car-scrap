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
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// Public Auth Routes
router.post('/login', loginValidator, validate, loginAdmin);
router.post('/refresh-token', refreshTokenValidator, validate, refreshAccessToken);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, resetPassword);

// Protected Auth Routes
router.use(verifyJWT);

router.post('/logout', logoutAdmin);
router.get('/me', getCurrentUser);

// Role-based Access Control Example Route
router.get('/super-admin-only', authorizeRoles('SUPER_ADMIN'), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome Super Admin!' });
});

module.exports = router;

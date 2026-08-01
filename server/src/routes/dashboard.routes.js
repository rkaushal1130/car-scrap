const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/stats', verifyJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'), getDashboardStats);

module.exports = router;

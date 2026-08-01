const express = require('express');
const router = express.Router();
const { getAllRoles, getAllPermissions } = require('../controllers/role.controller');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/roles', verifyJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getAllRoles);
router.get('/permissions', verifyJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getAllPermissions);

module.exports = router;

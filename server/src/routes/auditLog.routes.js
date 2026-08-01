const express = require('express');
const router = express.Router();
const { getAllAuditLogs } = require('../controllers/auditLog.controller');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/', verifyJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getAllAuditLogs);

module.exports = router;

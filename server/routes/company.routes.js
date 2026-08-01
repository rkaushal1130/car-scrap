const express = require('express');
const router = express.Router();

const {
  getCompanyInfo,
  updateCompanyInfo,
  uploadCompanyLogo,
  uploadCompanyFavicon,
  resetCompanyInfo,
} = require('../controllers/company.controller');

const { updateCompanyValidator } = require('../validators/company.validator');
const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Public Route
router.get('/', getCompanyInfo);

// Protected Admin Routes
router.use(verifyJWT);

router.post('/', authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateCompanyValidator, validate, updateCompanyInfo);
router.put('/', authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateCompanyValidator, validate, updateCompanyInfo);

router.post('/upload-logo', authorizeRoles('SUPER_ADMIN', 'ADMIN'), upload.single('logo'), uploadCompanyLogo);
router.post('/upload-favicon', authorizeRoles('SUPER_ADMIN', 'ADMIN'), upload.single('favicon'), uploadCompanyFavicon);

router.delete('/', authorizeRoles('SUPER_ADMIN'), resetCompanyInfo);

module.exports = router;

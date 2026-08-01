const express = require('express');
const router = express.Router();

const {
  getCompanyDetails,
  updateCompanyDetails,
  uploadCompanyAssets,
} = require('../controllers/company.controller');

const { updateCompanyValidator } = require('../validators/company.validator');
const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', getCompanyDetails);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN'));

router.put('/', updateCompanyValidator, validate, updateCompanyDetails);
router.post(
  '/upload-assets',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  uploadCompanyAssets
);

module.exports = router;

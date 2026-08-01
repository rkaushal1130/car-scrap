const express = require('express');
const router = express.Router();

const {
  getSeoByPage,
  updateSeoByPage,
  generateRobotsTxt,
  getSitemapConfig,
} = require('../controllers/seo.controller');

const {
  updateSeoValidator,
  pageIdentifierValidator,
} = require('../validators/seo.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/robots.txt', generateRobotsTxt);
router.get('/sitemap-config', getSitemapConfig);
router.get('/:pageIdentifier', pageIdentifierValidator, validate, getSeoByPage);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

router.put('/:pageIdentifier', updateSeoValidator, validate, updateSeoByPage);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  getGlobalSeo,
  getSeoByPageIdentifier,
  getAllSeoPages,
  createSeoPage,
  updateSeoPage,
  deleteSeoPage,
  getRobotsTxt,
  getSitemapData,
} = require('../controllers/seo.controller');

const {
  createSeoValidator,
  updateSeoValidator,
  getSeoQueryValidator,
} = require('../validators/seo.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// Public SEO Routes
router.get('/', getSeoQueryValidator, validate, getAllSeoPages);
router.get('/global', getGlobalSeo);
router.get('/robots.txt', getRobotsTxt);
router.get('/sitemap-config', getSitemapData);
router.get('/:pageIdentifier', getSeoByPageIdentifier);

// Protected Admin SEO Routes
router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'OPERATIONS_MANAGER'));

router.post('/', createSeoValidator, validate, createSeoPage);
router.put('/:identifier', updateSeoValidator, validate, updateSeoPage);
router.delete('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN'), deleteSeoPage);

module.exports = router;

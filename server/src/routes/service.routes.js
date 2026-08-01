const express = require('express');
const router = express.Router();

const {
  getAllServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/service.controller');

const {
  createServiceValidator,
  updateServiceValidator,
  serviceQueryValidator,
  serviceIdOrSlugValidator,
} = require('../validators/service.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, optionalJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.get('/', optionalJWT, serviceQueryValidator, validate, getAllServices);
router.get('/:idOrSlug', serviceIdOrSlugValidator, validate, getServiceByIdOrSlug);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'));

router.post('/', createServiceValidator, validate, createService);
router.put('/:id', updateServiceValidator, validate, updateService);
router.delete('/:id', deleteService);

module.exports = router;

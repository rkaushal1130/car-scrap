const express = require('express');
const router = express.Router();

const {
  createService,
  getAllServices,
  getServiceByIdOrSlug,
  updateService,
  deleteService,
  reorderServices,
} = require('../controllers/service.controller');

const {
  createServiceValidator,
  updateServiceValidator,
  getServicesQueryValidator,
  serviceIdValidator,
} = require('../validators/service.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// Public Routes
router.get('/', getServicesQueryValidator, validate, getAllServices);
router.get('/:identifier', getServiceByIdOrSlug);

// Protected Admin Routes
router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'OPERATIONS_MANAGER'));

router.post('/', createServiceValidator, validate, createService);
router.put('/:id', updateServiceValidator, validate, updateService);
router.patch('/reorder', reorderServices);

// Delete route restricted to Super Admin
router.delete('/:id', authorizeRoles('SUPER_ADMIN'), serviceIdValidator, validate, deleteService);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonial.controller');

const {
  createTestimonialValidator,
  updateTestimonialValidator,
  getTestimonialsQueryValidator,
  testimonialIdValidator,
} = require('../validators/testimonial.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, optionalJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// Public Routes
router.get('/', optionalJWT, getTestimonialsQueryValidator, validate, getAllTestimonials);
router.get('/:id', optionalJWT, testimonialIdValidator, validate, getTestimonialById);
router.post('/', createTestimonialValidator, validate, createTestimonial);

// Protected Admin Routes
router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'));

router.put('/:id', updateTestimonialValidator, validate, updateTestimonial);
router.delete('/:id', testimonialIdValidator, validate, deleteTestimonial);

module.exports = router;

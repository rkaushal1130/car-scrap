const express = require('express');
const router = express.Router();

const {
  createFaq,
  getAllFaqs,
  getFaqById,
  getFaqsGroupedByCategory,
  updateFaq,
  reorderFaqs,
  deleteFaq,
} = require('../controllers/faq.controller');

const {
  createFaqValidator,
  updateFaqValidator,
  getFaqsQueryValidator,
  faqIdValidator,
} = require('../validators/faq.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, optionalJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// Public Routes
router.get('/', optionalJWT, getFaqsQueryValidator, validate, getAllFaqs);
router.get('/grouped', optionalJWT, getFaqsGroupedByCategory);
router.get('/:id', optionalJWT, faqIdValidator, validate, getFaqById);

// Protected Admin Routes
router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER'));

router.post('/', createFaqValidator, validate, createFaq);
router.put('/:id', updateFaqValidator, validate, updateFaq);
router.patch('/reorder', reorderFaqs);
router.delete('/:id', faqIdValidator, validate, deleteFaq);

module.exports = router;

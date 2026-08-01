const express = require('express');
const router = express.Router();

const {
  getAllFaqs,
  getFaqsGroupedByCategory,
  createFaq,
  updateFaq,
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

router.get('/', optionalJWT, getFaqsQueryValidator, validate, getAllFaqs);
router.get('/grouped', optionalJWT, getFaqsGroupedByCategory);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'));

router.post('/', createFaqValidator, validate, createFaq);
router.put('/:id', updateFaqValidator, validate, updateFaq);
router.delete('/:id', faqIdValidator, validate, deleteFaq);

module.exports = router;

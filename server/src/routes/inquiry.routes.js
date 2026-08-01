const express = require('express');
const router = express.Router();

const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  addInquiryNote,
} = require('../controllers/inquiry.controller');

const {
  createInquiryValidator,
  updateInquiryStatusValidator,
  addInquiryNoteValidator,
  inquiryQueryValidator,
  inquiryIdValidator,
} = require('../validators/inquiry.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/', createInquiryValidator, validate, createInquiry);

router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'));

router.get('/', inquiryQueryValidator, validate, getAllInquiries);
router.get('/:id', inquiryIdValidator, validate, getInquiryById);
router.patch('/:id/status', updateInquiryStatusValidator, validate, updateInquiryStatus);
router.post('/:id/notes', addInquiryNoteValidator, validate, addInquiryNote);

module.exports = router;

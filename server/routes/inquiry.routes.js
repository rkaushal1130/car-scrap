const express = require('express');
const router = express.Router();

const {
  getAllInquiries,
  getInquiryById,
  markInquiryAsRead,
  updateInquiryStatus,
  addInquiryNote,
  deleteInquiry,
} = require('../controllers/inquiry.controller');

const {
  getInquiriesQueryValidator,
  updateInquiryStatusValidator,
  inquiryIdValidator,
  addNoteValidator,
} = require('../validators/contact.validator');

const validate = require('../middlewares/validate.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

// All inquiry management routes are protected (Admin staff only)
router.use(verifyJWT);
router.use(authorizeRoles('SUPER_ADMIN', 'OPERATIONS_MANAGER', 'SUPPORT_AGENT'));

router.get('/', getInquiriesQueryValidator, validate, getAllInquiries);
router.get('/:id', inquiryIdValidator, validate, getInquiryById);
router.patch('/:id/read', inquiryIdValidator, validate, markInquiryAsRead);
router.patch('/:id/status', updateInquiryStatusValidator, validate, updateInquiryStatus);
router.post('/:id/notes', addNoteValidator, validate, addInquiryNote);

// Deleting inquiries restricted to SuperAdmin
router.delete('/:id', authorizeRoles('SUPER_ADMIN'), inquiryIdValidator, validate, deleteInquiry);

module.exports = router;

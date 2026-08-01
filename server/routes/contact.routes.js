const express = require('express');
const router = express.Router();

const { submitInquiry } = require('../controllers/inquiry.controller');
const { submitInquiryValidator } = require('../validators/contact.validator');
const validate = require('../middlewares/validate.middleware');

// Public endpoint for submitting contact & valuation request
router.post('/submit', submitInquiryValidator, validate, submitInquiry);

module.exports = router;

const express = require('express');
const router = express.Router();
const { submitContactFormValidator } = require('../validators/contact.validator');
const validate = require('../middlewares/validate.middleware');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

router.post(
  '/',
  submitContactFormValidator,
  validate,
  asyncHandler(async (req, res) => {
    return res.status(200).json(
      new ApiResponse(
        200,
        { receivedAt: new Date() },
        'Thank you for contacting Car Scrap Platform! Our team will get back to you shortly.'
      )
    );
  })
);

module.exports = router;

const { body } = require('express-validator');
const { stringRule, phoneRule, emailRule } = require('./common.validator');

const submitContactFormValidator = [
  stringRule('fullName', { min: 2, max: 100, required: true, label: 'Full name' }),
  emailRule('email', 'Email address'),
  phoneRule('phoneNumber', 'Phone number'),
  stringRule('subject', { min: 2, max: 200, required: false, label: 'Subject' }),
  stringRule('message', { min: 10, max: 2000, required: true, label: 'Message' }),
];

module.exports = {
  submitContactFormValidator,
};

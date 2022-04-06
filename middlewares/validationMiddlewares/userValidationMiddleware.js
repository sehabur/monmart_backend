const { check } = require('express-validator');

const registerValidationMiddleware = [
  check('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('password must be atleast 6 characters'),
];

module.exports = {
  registerValidationMiddleware,
};

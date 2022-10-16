const { body } = require('express-validator');

module.exports = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Invalid password')
    .isStrongPassword()
    .withMessage('Not a strong password'),
];

// Do not have to get it from sub package anymore
// it is deprecated
const { body } = require('express-validator');

module.exports = [
  body('name', 'Invalid product name').isString().isLength({ min: 3 }),
  body('price', 'Invalid price')
    .isFloat()
    .custom((value) => {
      return Number(value) === 0 ? false : true;
    }),
  body('quantityAvailable', 'Invalid available quantity').isInt(),
];

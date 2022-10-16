const router = require('express').Router();

const productController = require('../../controllers/v1/product');
const productValidator = require('../../validators/v1/product');

router.get('/', productController.getProductsForUser);
router.get('/:productId', productController.getProductForUser);
router.delete('/:productId', productController.deleteProductForUser);
router.put(
  '/:productId',
  productValidator,
  productController.updateProductForUser
);
router.post('/', productValidator, productController.createProductForUser);

module.exports = router;

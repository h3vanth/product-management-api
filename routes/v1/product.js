const router = require('express').Router();

const productController = require('../../controllers/v1/product');
const productValidator = require('../../validators/v1/product');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', productValidator, productController.addProduct);
router.put('/:id', productValidator, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

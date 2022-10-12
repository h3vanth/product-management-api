const router = require('express').Router();

const productsController = require('../../controllers/v1/products');

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProduct);
router.post('/', productsController.addProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;

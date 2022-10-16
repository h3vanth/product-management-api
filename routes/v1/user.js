const router = require('express').Router();

const userController = require('../../controllers/v1/user');
const userValidator = require('../../validators/v1/user');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userValidator, userController.addUser);
router.put('/:id', userValidator, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

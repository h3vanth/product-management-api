const router = require('express').Router();

const userController = require('../../controllers/v1/user');
const userValidator = require('../../validators/v1/user');

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Admin routes
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.put('/:userId', userValidator, userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;

const router = require('express').Router();

const authController = require('../../controllers/v1/auth');
const userValidator = require('../../validators/v1/user');

router.post('/signup', userValidator, authController.signup);
router.post('/login', authController.login);

module.exports = router;

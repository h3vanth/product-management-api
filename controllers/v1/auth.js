const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const { createToken } = require('../../helpers/v1/auth');

const User = require('../../models/v1/user');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.login(email, password);
  if (user) {
    const token = createToken(user._id);
    res.setHeader('Authorization', 'Bearer ' + token);
    res.status(200).end();
  } else {
    res.status(404).json({ errorCode: '404', message: 'User not found' });
  }
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorCode: '400',
      message: 'Bad request',
      errors: errors.array().map(({ param, msg }) => ({ param, msg })),
    });
  }
  try {
    const { email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({
        errorCode: '400',
        message: 'Bad request: User with given email already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User({ email, password: hashedPassword }).save();
    const token = createToken(user._id);
    res.setHeader('Authorization', 'Bearer ' + token);
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

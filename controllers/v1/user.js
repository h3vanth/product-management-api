const bcrypt = require('bcryptjs');

const User = require('../../models/v1/user');
const { validationResult } = require('express-validator');

exports.getUsers = (req, res, next) => {
  User.find()
    .select('email')
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .select('email products')
    .populate('products', '-__v -user')
    .then((user) => {
      if (!user) {
        res.status(404).json({ errorCode: '404', message: 'User not found' });
      } else {
        res.status(200).json({ user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorCode: '400',
      message: 'Bad request',
      errors: errors.array().map(({ param, msg }) => ({ param, msg })),
    });
  }
  const { email, password } = req.body;

  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ errorCode: '404', message: 'User not found' });
      }
      user.email = email;
      user.password = password;
      return user.save();
    })
    .then((user) => {
      res.status(200).end();
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).end();
      } else {
        res.status(404).json({ errorCode: '404', message: 'User not found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getProfile = (req, res, next) => {
  User.findById(req.userId)
    .select('email')
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { email, password, update } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        errorCode: 404,
        message: 'User not found',
      });
    }
    if (!(await bcrypt.compare(password, hashedPassword))) {
      return res.status(400).json({
        errorCode: 400,
        message: 'Bad request: Please enter correct password',
      });
    }
    if (update === 'EMAIL') {
      user.email = email;
    } else if (update === 'PASSWORD') {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }
    await user.save();
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

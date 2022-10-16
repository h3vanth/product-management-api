const User = require('../../models/v1/user');
const { validationResult } = require('express-validator');

exports.getUsers = (req, res, next) => {
  User.find()
    .select('email')
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
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
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

exports.addUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorCode: '400',
      message: 'Bad request',
      errors: errors.array().map(({ param, msg }) => ({ param, msg })),
    });
  }
  const user = new User(req.body);
  user
    .save()
    .then((user) => {
      res.status(201).json({
        user: {
          _id: user._id,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
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

  User.findById(req.params.id)
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
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).end();
      } else {
        res.status(404).json({ errorCode: '404', message: 'User not found' });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

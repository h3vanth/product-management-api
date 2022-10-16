const User = require('../../models/v1/user');
const Product = require('../../models/v1/product');

const { validationResult } = require('express-validator');

exports.getProductsForUser = (req, res, next) => {
  User.findById(req.userId)
    .select('products')
    .populate('products', '-__v -user')
    .then((products) => {
      res.status(200).json({ products: products.products });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getProductForUser = (req, res, next) => {
  Product.findOne({ _id: req.params.productId, user: req.userId })
    .select('-__v -user')
    .then((product) => {
      if (!product) {
        res
          .status(404)
          .json({ errorCode: '404', message: 'Product not found' });
      } else {
        res.status(200).json({ product });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteProductForUser = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      user: req.userId,
    });

    if (!product) {
      res.status(404).json({ errorCode: '404', message: 'Product not found' });
    } else {
      await product.remove();
      res.status(200).end();
    }
  } catch (err) {
    next(err);
  }
};

exports.updateProductForUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorCode: '400',
      message: 'Bad request',
      errors: errors.array().map(({ param, msg }) => ({ param, msg })),
    });
  }
  const { name, price, quantityAvailable } = req.body;
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      user: req.userId,
    });
    if (!product) {
      res.status(404).json({ errorCode: '404', message: 'Product not found' });
    } else {
      product.name = name;
      product.price = price;
      product.quantityAvailable = quantityAvailable;
      await product.save();
      res.status(200).end();
    }
  } catch (err) {
    next(err);
  }
};

exports.createProductForUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorCode: '400',
      message: 'Bad request',
      errors: errors.array().map(({ param, msg }) => ({ param, msg })),
    });
  }

  try {
    const product = await new Product({
      ...req.body,
      user: req.userId,
    }).save();
    const user = await User.findById(req.userId);
    user.products.push(product);
    await user.save();
    res.status(201).json({
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantityAvailable: product.quantityAvailable,
      },
    });
  } catch (err) {
    next(err);
  }
};

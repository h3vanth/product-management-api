const Product = require('../../models/v1/product');

exports.getProducts = (req, res, next) => {
  Product.find()
    .select('name price quantityAvailable')
    .then((products) => {
      res.status(200).json({ products });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .select('name price quantityAvailable')
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
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

exports.addProduct = (req, res, next) => {
  const product = new Product(req.body);
  product
    .save()
    .then((product) => {
      res.status(201).json({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantityAvailable: product.quantityAvailable,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

exports.updateProduct = (req, res, next) => {
  const { name, price, quantityAvailable } = req.body;

  Product.findById(req.params.id)
    .select('name price quantityAvailable')
    .then((product) => {
      if (!product) {
        return res
          .status(404)
          .json({ errorCode: '404', message: 'Product not found' });
      }
      product.name = name;
      product.price = price;
      product.quantityAvailable = quantityAvailable;
      return product.save();
    })
    .then((product) => {
      res.status(200).json({ product });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).end();
      } else {
        res
          .status(404)
          .json({ errorCode: '404', message: 'Product not found' });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorCode: '500', message: 'Something went wrong' });
    });
};

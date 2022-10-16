const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, `.env.${process.env.APP_ENV}`),
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/v1/product');
const userRoutes = require('./routes/v1/user');

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/users/:userId/products', (req, res, next) => {
  req.userId = req.params.userId;
  productRoutes(req, res, next);
});
app.use('/api/v1/users', userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ errorCode: '404', message: 'Not a valid route' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ errorCode: '500', message: 'Something went wrong' });
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to DB!');
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));

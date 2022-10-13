const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, `.env.${process.env.APP_ENV}`),
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/v1/product');

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/products', productRoutes);

app.use((req, res, next) => {
  res.status(404).json({ errorCode: '404', message: 'Not a valid route' });
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to DB!');
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));

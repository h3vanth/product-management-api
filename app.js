const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, `.env.${process.env.APP_ENV}`),
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/v1/auth');
const productRoutes = require('./routes/v1/product');
const userRoutes = require('./routes/v1/user');

const { checkToken } = require('./helpers/v1/auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/api/v1/auth', authRoutes);
// For matching
// /api/v1/users
// /api/v1/user
app.use(/\/api\/v1\/users?/, checkToken, userRoutes);
app.use('/api/v1/products', checkToken, productRoutes);

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

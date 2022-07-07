// Package Imports //
const express = require('express');
const path = require('path');
const logger = require('morgan');
const dotenv = require('dotenv');

// Internal Imports //
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const {
  NotFoundHanlder,
  ErrorHanlder,
} = require('./middlewares/errorHandlingMiddleware');

const app = express();
dotenv.config();

// App Middlewares //
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://monmart.herokuapp.com/'
  ); // For dev purpose //
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// Routes //
app.use('/api/products/', productRoute);
app.use('/api/users/', userRoute);
app.use('/api/orders/', orderRoute);

// catch 404 and forward to NotFoundHanlder //
app.use(NotFoundHanlder);

// error handler
app.use(ErrorHanlder);

module.exports = app;

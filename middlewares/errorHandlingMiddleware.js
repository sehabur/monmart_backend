const createError = require('http-errors');

// catch 404 and forward to NotFoundHanlder //
const NotFoundHanlder = (req, res, next) => {
  next(createError(404, 'Page not found'));
};

const ErrorHanlder = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: err.error || 'error',
  });
};

module.exports = {
  NotFoundHanlder,
  ErrorHanlder,
};

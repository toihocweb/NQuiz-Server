import ErrorResponse from '../model/response/ErrorResponse';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // mongoose bad object id
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(404, message, 'bad_object_id');
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse(400, err.keyValue, 'duplicate');
  }

  // mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(400, message, 'validation');
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    type: error.type,
  });
};

export default errorHandler;

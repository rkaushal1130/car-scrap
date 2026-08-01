class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode || 500;
    this.data = null;
    this.message = message || 'An unexpected error occurred';
    this.success = false;
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized Access', errors = []) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = 'Forbidden Access', errors = []) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = 'Resource Not Found', errors = []) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = 'Resource Conflict', errors = []) {
    return new ApiError(409, message, errors);
  }

  static internal(message = 'Internal Server Error', errors = []) {
    return new ApiError(500, message, errors);
  }
}

module.exports = ApiError;

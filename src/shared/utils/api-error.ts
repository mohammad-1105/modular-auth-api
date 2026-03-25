export class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: unknown;
  isOperational: boolean;

  constructor(statusCode: number, message: string, errors: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  // Static factory methods (generic only)

  static badRequest(message: string = "Bad Request", errors: unknown = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = "unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message: string = "Conflict") {
    return new ApiError(409, message);
  }

  static internal(message: string = "Internal Server Error") {
    return new ApiError(500, message);
  }
}

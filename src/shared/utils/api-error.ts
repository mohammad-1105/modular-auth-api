export class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: unknown;
  isOperational: boolean;

  /**
   * Additional metadata (optional)
   * Useful for:
   * - rate limiting info
   * - debugging context
   * - structured logging
   */
  meta?: Record<string, unknown>;

  constructor(
    statusCode: number,
    message: string,
    errors: unknown = null,
    meta?: Record<string, unknown>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;
    if (meta !== undefined) {
      this.meta = meta;
    }

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

  static tooManyRequests(message: string = "Too many requests", retryAfter?: number) {
    return new ApiError(429, message, null, retryAfter ? { retryAfter } : undefined);
  }

  static internal(message: string = "Internal Server Error") {
    return new ApiError(500, message);
  }
}

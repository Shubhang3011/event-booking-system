/**
 * Operational error with an HTTP status code and a stable machine-readable
 * `code`. Thrown anywhere in the request lifecycle and translated into a JSON
 * response by the central error handler.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly isOperational = true;

  constructor(statusCode: number, message: string, code = 'ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new AppError(400, message, 'BAD_REQUEST', details);
  }
  static unauthorized(message = 'Authentication required') {
    return new AppError(401, message, 'UNAUTHORIZED');
  }
  static forbidden(message = 'You do not have access to this resource') {
    return new AppError(403, message, 'FORBIDDEN');
  }
  static notFound(message = 'Resource not found') {
    return new AppError(404, message, 'NOT_FOUND');
  }
  static conflict(message = 'Conflict', details?: unknown) {
    return new AppError(409, message, 'CONFLICT', details);
  }
  static unprocessable(message = 'Validation failed', details?: unknown) {
    return new AppError(422, message, 'VALIDATION_ERROR', details);
  }
  static tooManyRequests(message = 'Too many requests, please slow down') {
    return new AppError(429, message, 'RATE_LIMITED');
  }
}

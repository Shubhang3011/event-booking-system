import type { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { AppError } from '../lib/AppError';
import { isProd } from '../config/env';
import { logger } from '../lib/logger';

/** 404 for any route that didn't match. */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

interface ErrorBody {
  message: string;
  code: string;
  details?: unknown;
  stack?: string;
}

/** Translate any thrown error into a consistent JSON error envelope. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  let status = 500;
  let body: ErrorBody = { message: 'Something went wrong', code: 'INTERNAL_ERROR' };

  if (err instanceof AppError) {
    status = err.statusCode;
    body = { message: err.message, code: err.code, details: err.details };
  } else if (err instanceof ZodError) {
    status = 422;
    body = {
      message: 'One or more fields are invalid',
      code: 'VALIDATION_ERROR',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    };
  } else if (err instanceof MongooseError.CastError) {
    status = 400;
    body = { message: `Invalid value for "${err.path}"`, code: 'BAD_REQUEST' };
  } else if (err instanceof MongooseError.ValidationError) {
    status = 422;
    body = {
      message: 'One or more fields are invalid',
      code: 'VALIDATION_ERROR',
      details: Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })),
    };
  } else if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    status = 409;
    const fields = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {});
    body = { message: `That ${fields.join(', ') || 'value'} is already in use`, code: 'CONFLICT' };
  } else if (err instanceof jwt.JsonWebTokenError) {
    status = 401;
    body = { message: 'Invalid authentication token', code: 'UNAUTHORIZED' };
  }

  // Log server-side faults (not routine 4xx client errors).
  if (status >= 500) {
    logger.error(err);
  }

  if (!isProd && err instanceof Error) {
    body.stack = err.stack;
  }

  res.status(status).json({ error: body });
}

import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../lib/AppError';
import { verifyAuthToken } from '../lib/jwt';

/** Extract the auth token from the httpOnly cookie or a Bearer header. */
function extractToken(req: Request): string | null {
  const cookieToken = req.cookies?.[env.COOKIE_NAME];
  if (cookieToken) return cookieToken;

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();

  return null;
}

/** Reject the request unless it carries a valid auth token. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    next(AppError.unauthorized('You must be signed in to do that'));
    return;
  }
  try {
    const { sub } = verifyAuthToken(token);
    req.userId = sub;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(AppError.unauthorized('Your session has expired, please sign in again'));
      return;
    }
    next(AppError.unauthorized('Invalid authentication token'));
  }
}

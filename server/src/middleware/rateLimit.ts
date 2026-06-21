import rateLimit from 'express-rate-limit';
import { isTest } from '../config/env';

// Disable throttling under test so suites can fire many requests quickly.
const max = (limit: number) => (isTest ? 1_000_000 : limit);

/** Stricter limit on auth endpoints to blunt credential-stuffing / brute force. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: max(30),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many attempts, please try again later', code: 'RATE_LIMITED' } },
});

/** Gentle global limit to protect the API from runaway clients. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: max(600),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests, please slow down', code: 'RATE_LIMITED' } },
});

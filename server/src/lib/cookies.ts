import type { CookieOptions, Response } from 'express';
import { cookieSameSite, cookieSecure, env } from '../config/env';

/** Parse a zeit/ms-style duration ("7d", "12h", "30m", "45s") into milliseconds. */
function durationToMs(value: string): number {
  const match = /^(\d+)\s*(d|h|m|s)?$/.exec(value.trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000; // sensible default: 7 days
  const amount = Number(match[1]);
  const unit = (match[2] ?? 's') as 'd' | 'h' | 'm' | 's';
  const unitMs = { d: 86_400_000, h: 3_600_000, m: 60_000, s: 1_000 }[unit];
  return amount * unitMs;
}

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true, // not readable from JS — mitigates XSS token theft
    // Cross-site cookies (SameSite=None) must also be Secure per browser rules.
    sameSite: cookieSameSite,
    secure: cookieSameSite === 'none' ? true : cookieSecure,
    path: '/',
    maxAge: durationToMs(env.JWT_EXPIRES_IN),
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(env.COOKIE_NAME, token, cookieOptions());
}

export function clearAuthCookie(res: Response): void {
  // Mirror the attributes used when setting the cookie so browsers actually
  // remove it.
  const { maxAge, ...rest } = cookieOptions();
  void maxAge;
  res.clearCookie(env.COOKIE_NAME, rest);
}

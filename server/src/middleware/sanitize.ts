import type { NextFunction, Request, Response } from 'express';

/**
 * Recursively remove keys that MongoDB could interpret as query operators
 * (`$gt`, `$where`, …) or dotted paths (`a.b`). Defends against NoSQL operator
 * injection. Mutates objects in place so we never reassign Express's read-only
 * `req.query` getter.
 */
function scrub(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(scrub);
    return;
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value as Record<string, unknown>)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete (value as Record<string, unknown>)[key];
        continue;
      }
      scrub((value as Record<string, unknown>)[key]);
    }
  }
}

export function mongoSanitize(req: Request, _res: Response, next: NextFunction): void {
  scrub(req.body);
  scrub(req.query);
  scrub(req.params);
  next();
}

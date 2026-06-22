import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { allowedOrigins, clientDist, isProd, isTest } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error';
import { apiLimiter } from './middleware/rateLimit';
import { mongoSanitize } from './middleware/sanitize';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  // Behind a reverse proxy (Render/Railway/Nginx) so secure cookies and the
  // rate limiter see the real client IP.
  if (isProd) app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Security headers. When serving the SPA we relax the CSP just enough for
  // Google Fonts + React inline styles; the API-only mode keeps helmet defaults.
  app.use(
    helmet(
      clientDist
        ? {
            contentSecurityPolicy: {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
              },
            },
          }
        : undefined,
    ),
  );

  // CORS with an explicit allowlist; credentials enabled for cookie auth.
  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin and non-browser clients (curl, server-to-server)
        // which send no Origin header. Disallowed cross-origin requests simply
        // receive no CORS headers (the browser blocks them) — we never 500.
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      credentials: true,
    }),
  );

  // Body parsing with a tight size limit to blunt payload-flood attacks.
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(cookieParser());

  // Strip NoSQL operator injection attempts.
  app.use(mongoSanitize);

  if (!isTest) app.use(morgan('dev'));

  app.use('/api', apiLimiter, apiRouter);

  if (clientDist) {
    // Single-service deployment: serve the built React app and let the client
    // router handle all non-API routes (SPA fallback).
    app.use(express.static(clientDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    app.get('/', (_req, res) => {
      res.json({ data: { name: 'Event Booking System API', health: '/api/health' } });
    });
  }

  // 404 + centralized error handling (must be last).
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();

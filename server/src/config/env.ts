import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const DEFAULT_SECRET = 'dev-only-secret-change-me';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  // Empty string => fall back to an in-memory MongoDB (see db/connect.ts).
  MONGO_URI: z.string().trim().default(''),
  JWT_SECRET: z.string().min(1).default(DEFAULT_SECRET),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  COOKIE_NAME: z.string().default('ebs_token'),
  // Cookie flags, decoupled from NODE_ENV so the app works across same-origin
  // (http), cross-site (https) and reverse-proxied deployments.
  COOKIE_SECURE: z.enum(['true', 'false']).optional(),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).optional(),
  // Absolute path to the built frontend (web/dist). When set, the API also
  // serves the SPA — enabling a single-service deployment.
  CLIENT_DIST: z.string().optional(),
  BCRYPT_ROUNDS: z.coerce.number().int().min(4).max(15).default(12),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  // eslint-disable-next-line no-console
  console.error(`\n❌ Invalid environment configuration:\n${issues}\n`);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Allow one or more comma-separated origins (handy when a deployed frontend and
// localhost both need access). Render injects RENDER_EXTERNAL_URL automatically.
export const allowedOrigins = [
  ...env.CLIENT_ORIGIN.split(',').map((o) => o.trim()),
  process.env.RENDER_EXTERNAL_URL ?? '',
].filter(Boolean);

// When set, the API also serves the built SPA (single-service deployment).
export const clientDist = env.CLIENT_DIST?.trim() ?? '';

// Cookie security: default to NODE_ENV, but allow explicit overrides.
export const cookieSecure = env.COOKIE_SECURE ? env.COOKIE_SECURE === 'true' : isProd;
export const cookieSameSite: 'lax' | 'strict' | 'none' =
  env.COOKIE_SAMESITE ?? (isProd ? 'none' : 'lax');

// Fail fast on insecure production configuration rather than silently shipping
// a default signing key.
if (isProd) {
  const problems: string[] = [];
  if (env.JWT_SECRET === DEFAULT_SECRET || env.JWT_SECRET.length < 32) {
    problems.push('JWT_SECRET must be a strong, unique value (>= 32 chars) in production.');
  }
  if (!env.MONGO_URI) {
    problems.push('MONGO_URI must be set in production (the in-memory database is dev-only).');
  }
  if (problems.length) {
    // eslint-disable-next-line no-console
    console.error(`\n❌ Unsafe production configuration:\n${problems.map((p) => `  - ${p}`).join('\n')}\n`);
    process.exit(1);
  }
}

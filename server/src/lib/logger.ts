/* Tiny structured-ish logger. Intentionally dependency-free — the app's HTTP
 * access logs come from morgan; this is for lifecycle/startup messages. */
import { isTest } from '../config/env';

function ts(): string {
  return new Date().toISOString();
}

export const logger = {
  info: (...args: unknown[]) => {
    if (!isTest) console.log(`[${ts()}] INFO`, ...args);
  },
  warn: (...args: unknown[]) => {
    if (!isTest) console.warn(`[${ts()}] WARN`, ...args);
  },
  error: (...args: unknown[]) => {
    console.error(`[${ts()}] ERROR`, ...args);
  },
};

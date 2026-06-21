import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    // One in-memory MongoDB shared across all test files, run sequentially so
    // tests never contend on the same database.
    fileParallelism: false,
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
});

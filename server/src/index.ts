import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './db/connect';
import { seedDatabase } from './db/seed';
import { logger } from './lib/logger';
import { Event } from './modules/events/event.model';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  // Make sure there's something to explore on first run.
  if (!env.MONGO_URI) {
    // Ephemeral in-memory DB — always seed fresh sample data.
    await seedDatabase({ reset: true, quiet: true });
    logger.info('Seeded sample events into the in-memory database.');
  } else if ((await Event.estimatedDocumentCount()) === 0) {
    logger.info('Database is empty — seeding sample events (run `npm run seed` to reset).');
    await seedDatabase({ reset: false, quiet: true });
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`API ready at http://localhost:${env.PORT}  (env: ${env.NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    // Force-exit if connections don't drain in time.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error('Fatal: failed to start server', err);
  process.exit(1);
});

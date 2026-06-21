import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../lib/logger';

// Kept at module scope so we can stop it on shutdown.
let memoryServer: { stop: () => Promise<boolean> } | undefined;

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  let uri = env.MONGO_URI;

  if (!uri) {
    // Zero-config developer experience: no database install required. Spins up
    // an ephemeral in-memory MongoDB. Never used in production (env.ts enforces
    // MONGO_URI there).
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const server = await MongoMemoryServer.create();
    memoryServer = server;
    uri = server.getUri();
    logger.warn('No MONGO_URI set — started an in-memory MongoDB (data is NOT persisted).');
  }

  await mongoose.connect(uri);
  logger.info('Connected to MongoDB');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}

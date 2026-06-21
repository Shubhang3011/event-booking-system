import fs from 'node:fs';
import path from 'node:path';
import { afterAll, afterEach, beforeAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Spin up a single in-memory MongoDB for the whole test run. Each test gets a
// clean slate via the afterEach hook, so suites stay isolated and fast.
let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

  // Keep mongod's data files inside the project (on D:) rather than the system
  // temp dir, which may live on a full C: drive.
  const tmp = path.join(process.cwd(), '.cache', 'mongo-tmp');
  fs.mkdirSync(tmp, { recursive: true });
  process.env.TMPDIR = tmp;
  process.env.TMP = tmp;
  process.env.TEMP = tmp;

  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

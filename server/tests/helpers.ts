import request from 'supertest';
import { app } from '../src/app';
import { Event } from '../src/modules/events/event.model';

const DAY = 24 * 60 * 60 * 1000;

/** Insert an event, overriding any fields the test cares about. */
export function makeEvent(overrides: Record<string, unknown> = {}) {
  return Event.create({
    title: 'Test Event',
    description: 'A test event for the suite.',
    date: new Date(Date.now() + 7 * DAY),
    venue: 'Test Venue',
    city: 'Test City',
    category: 'Music',
    organizer: 'Test Org',
    totalSeats: 10,
    availableSeats: 10,
    ...overrides,
  });
}

/** A supertest agent that has registered (and is therefore authenticated). */
export async function authedAgent(email = 'user@test.dev') {
  const agent = request.agent(app);
  await agent.post('/api/auth/register').send({ name: 'Test User', email, password: 'password123' });
  return agent;
}

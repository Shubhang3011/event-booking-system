import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { Event } from '../src/modules/events/event.model';
import { authedAgent, makeEvent } from './helpers';

const futureIso = () => new Date(Date.now() + 14 * 86_400_000).toISOString();
const eventBody = (over: Record<string, unknown> = {}) => ({
  title: 'My New Event',
  description: 'A lovely test event description.',
  date: futureIso(),
  venue: 'Test Venue',
  city: 'Test City',
  category: 'Music',
  organizer: 'Me',
  totalSeats: 50,
  ...over,
});

describe('Organizer CRUD', () => {
  it('requires auth to create an event', async () => {
    const res = await request(app).post('/api/events').send(eventBody());
    expect(res.status).toBe(401);
  });

  it('creates an event (availableSeats = totalSeats) and lists it under /mine', async () => {
    const agent = await authedAgent('org1@test.dev');
    const res = await agent.post('/api/events').send(eventBody({ totalSeats: 40 }));
    expect(res.status).toBe(201);
    expect(res.body.data.availableSeats).toBe(40);

    const mine = await agent.get('/api/events/mine');
    expect(mine.body.data).toHaveLength(1);
    expect(mine.body.data[0].title).toBe('My New Event');
  });

  it('validates input (past date, too-short title)', async () => {
    const agent = await authedAgent('org2@test.dev');
    const past = eventBody({ date: new Date(Date.now() - 86_400_000).toISOString() });
    expect((await agent.post('/api/events').send(past)).status).toBe(422);
    expect((await agent.post('/api/events').send(eventBody({ title: 'a' }))).status).toBe(422);
  });

  it('only the owner can update or delete', async () => {
    const owner = await authedAgent('org3@test.dev');
    const other = await authedAgent('org4@test.dev');
    const created = await owner.post('/api/events').send(eventBody());
    const id = created.body.data.id;

    expect((await other.patch(`/api/events/${id}`).send({ title: 'Hacked' })).status).toBe(403);
    expect((await other.delete(`/api/events/${id}`)).status).toBe(403);

    const upd = await owner.patch(`/api/events/${id}`).send({ title: 'Renamed' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.title).toBe('Renamed');

    expect((await owner.delete(`/api/events/${id}`)).status).toBe(200);
    expect((await request(app).get(`/api/events/${id}`)).status).toBe(404);
  });

  it('denormalizes the rating average + count onto the event', async () => {
    const event = await makeEvent();
    const a = await authedAgent('rev1@test.dev');
    const b = await authedAgent('rev2@test.dev');
    await a.post(`/api/events/${event.id}/reviews`).send({ rating: 5 });
    await b.post(`/api/events/${event.id}/reviews`).send({ rating: 3 });

    const fresh = await Event.findById(event.id);
    expect(fresh?.ratingCount).toBe(2);
    expect(fresh?.ratingAverage).toBe(4);
  });
});

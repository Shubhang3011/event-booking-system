import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { makeEvent } from './helpers';

describe('Events', () => {
  it('lists events with pagination metadata', async () => {
    await makeEvent({ title: 'Alpha' });
    await makeEvent({ title: 'Beta', email: undefined });

    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination).toMatchObject({ page: 1, total: 2, totalPages: 1 });
  });

  it('exposes derived status fields', async () => {
    await makeEvent({ availableSeats: 0 });
    const res = await request(app).get('/api/events');
    expect(res.body.data[0]).toMatchObject({ isSoldOut: true, status: 'sold_out' });
  });

  it('filters by category and excludes past events by default', async () => {
    await makeEvent({ title: 'Gig', category: 'Music' });
    await makeEvent({ title: 'Talk', category: 'Technology' });
    await makeEvent({ title: 'Old', date: new Date(Date.now() - 86_400_000) });

    const music = await request(app).get('/api/events?category=Music');
    expect(music.body.data).toHaveLength(1);
    expect(music.body.data[0].title).toBe('Gig');

    const upcoming = await request(app).get('/api/events');
    expect(upcoming.body.data.map((e: { title: string }) => e.title)).not.toContain('Old');
  });

  it('searches across title and venue', async () => {
    await makeEvent({ title: 'Jazz Night', venue: 'Blue Bar' });
    await makeEvent({ title: 'Tech Talk', venue: 'Hall A' });
    const res = await request(app).get('/api/events?search=jazz');
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Jazz Night');
  });

  it('returns a single event, 404 for unknown id, 422 for malformed id', async () => {
    const event = await makeEvent();
    const ok = await request(app).get(`/api/events/${event.id}`);
    expect(ok.status).toBe(200);
    expect(ok.body.data.id).toBe(event.id);

    expect((await request(app).get('/api/events/0123456789abcdef01234567')).status).toBe(404);
    expect((await request(app).get('/api/events/not-an-id')).status).toBe(422);
  });
});

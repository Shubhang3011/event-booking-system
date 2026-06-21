import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { authedAgent, makeEvent } from './helpers';

describe('Reviews', () => {
  it('requires auth to post a review', async () => {
    const event = await makeEvent();
    const res = await request(app).post(`/api/events/${event.id}/reviews`).send({ rating: 5 });
    expect(res.status).toBe(401);
  });

  it('lists reviews with a summary, one review per user (upsert)', async () => {
    const event = await makeEvent();
    const alice = await authedAgent('ra@test.dev');

    let res = await request(app).get(`/api/events/${event.id}/reviews`);
    expect(res.body.data.summary).toMatchObject({ count: 0, average: 0 });

    await alice.post(`/api/events/${event.id}/reviews`).send({ rating: 5, comment: 'Loved it' }).expect(201);
    res = await request(app).get(`/api/events/${event.id}/reviews`);
    expect(res.body.data.reviews).toHaveLength(1);
    expect(res.body.data.reviews[0]).toMatchObject({ rating: 5, comment: 'Loved it', user: 'Test User' });
    expect(res.body.data.summary).toMatchObject({ count: 1, average: 5 });

    // Same user reviews again -> updates, does not duplicate.
    await alice.post(`/api/events/${event.id}/reviews`).send({ rating: 3 }).expect(201);
    res = await request(app).get(`/api/events/${event.id}/reviews`);
    expect(res.body.data.reviews).toHaveLength(1);
    expect(res.body.data.summary.average).toBe(3);
  });

  it('averages across users and supports delete', async () => {
    const event = await makeEvent();
    const alice = await authedAgent('rb1@test.dev');
    const bob = await authedAgent('rb2@test.dev');
    await alice.post(`/api/events/${event.id}/reviews`).send({ rating: 5 }).expect(201);
    await bob.post(`/api/events/${event.id}/reviews`).send({ rating: 1 }).expect(201);

    let res = await request(app).get(`/api/events/${event.id}/reviews`);
    expect(res.body.data.summary).toMatchObject({ count: 2, average: 3 });

    await alice.delete(`/api/events/${event.id}/reviews`).expect(200);
    res = await request(app).get(`/api/events/${event.id}/reviews`);
    expect(res.body.data.summary.count).toBe(1);
  });

  it('validates the rating range', async () => {
    const event = await makeEvent();
    const alice = await authedAgent('rc@test.dev');
    expect((await alice.post(`/api/events/${event.id}/reviews`).send({ rating: 0 })).status).toBe(422);
    expect((await alice.post(`/api/events/${event.id}/reviews`).send({ rating: 6 })).status).toBe(422);
  });
});

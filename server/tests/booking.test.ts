import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { Event } from '../src/modules/events/event.model';
import { authedAgent, makeEvent } from './helpers';

describe('Bookings', () => {
  it('requires authentication to book', async () => {
    const event = await makeEvent();
    const res = await request(app).post('/api/bookings').send({ eventId: event.id, seats: 1 });
    expect(res.status).toBe(401);
  });

  it('creates a booking, decrements seats, and returns a code + populated event', async () => {
    const event = await makeEvent({ totalSeats: 10, availableSeats: 10 });
    const agent = await authedAgent();

    const res = await agent.post('/api/bookings').send({ eventId: event.id, seats: 3 });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('CONFIRMED');
    expect(res.body.data.bookingCode).toMatch(/^LM-/);
    expect(res.body.data.event.title).toBe('Test Event');

    const after = await Event.findById(event.id);
    expect(after?.availableSeats).toBe(7);
  });

  it('prevents booking more seats than available', async () => {
    const event = await makeEvent({ totalSeats: 5, availableSeats: 2 });
    const agent = await authedAgent();
    const res = await agent.post('/api/bookings').send({ eventId: event.id, seats: 3 });
    expect(res.status).toBe(409);

    const after = await Event.findById(event.id);
    expect(after?.availableSeats).toBe(2); // unchanged
  });

  it('validates the seat count (1..10, integer)', async () => {
    const event = await makeEvent();
    const agent = await authedAgent();
    expect((await agent.post('/api/bookings').send({ eventId: event.id, seats: 0 })).status).toBe(422);
    expect((await agent.post('/api/bookings').send({ eventId: event.id, seats: 99 })).status).toBe(422);
    expect((await agent.post('/api/bookings').send({ eventId: event.id, seats: 1.5 })).status).toBe(422);
  });

  it('refuses bookings for past events', async () => {
    const event = await makeEvent({ date: new Date(Date.now() - 86_400_000) });
    const agent = await authedAgent();
    const res = await agent.post('/api/bookings').send({ eventId: event.id, seats: 1 });
    expect(res.status).toBe(400);
  });

  it('lists only the current user’s bookings', async () => {
    const event = await makeEvent();
    const alice = await authedAgent('alice@test.dev');
    const bob = await authedAgent('bob@test.dev');
    await alice.post('/api/bookings').send({ eventId: event.id, seats: 1 });

    const aliceList = await alice.get('/api/bookings');
    const bobList = await bob.get('/api/bookings');
    expect(aliceList.body.data).toHaveLength(1);
    expect(bobList.body.data).toHaveLength(0);
  });

  it('cancels a booking and releases the seats', async () => {
    const event = await makeEvent({ totalSeats: 10, availableSeats: 10 });
    const agent = await authedAgent();
    const created = await agent.post('/api/bookings').send({ eventId: event.id, seats: 4 });
    const id = created.body.data.id;

    expect((await Event.findById(event.id))?.availableSeats).toBe(6);

    const cancel = await agent.patch(`/api/bookings/${id}/cancel`);
    expect(cancel.status).toBe(200);
    expect(cancel.body.data.status).toBe('CANCELLED');
    expect((await Event.findById(event.id))?.availableSeats).toBe(10);
  });

  it('cannot cancel the same booking twice', async () => {
    const event = await makeEvent();
    const agent = await authedAgent();
    const created = await agent.post('/api/bookings').send({ eventId: event.id, seats: 1 });
    const id = created.body.data.id;
    await agent.patch(`/api/bookings/${id}/cancel`).expect(200);
    const second = await agent.patch(`/api/bookings/${id}/cancel`);
    expect(second.status).toBe(400);
  });

  it("cannot cancel another user's booking", async () => {
    const event = await makeEvent();
    const alice = await authedAgent('alice2@test.dev');
    const bob = await authedAgent('bob2@test.dev');
    const created = await alice.post('/api/bookings').send({ eventId: event.id, seats: 1 });
    const id = created.body.data.id;

    const res = await bob.patch(`/api/bookings/${id}/cancel`);
    expect(res.status).toBe(403);
    // Seats were not released.
    expect((await Event.findById(event.id))?.availableSeats).toBe(event.totalSeats - 1);
  });
});

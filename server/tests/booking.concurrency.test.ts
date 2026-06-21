import { describe, expect, it } from 'vitest';
import { Event } from '../src/modules/events/event.model';
import { authedAgent, makeEvent } from './helpers';

/**
 * The core guarantee: under heavy concurrency, an event can never oversell.
 * We fire many more simultaneous single-seat bookings than there are seats and
 * assert that exactly `availableSeats` succeed and the rest are rejected.
 */
describe('Booking concurrency', () => {
  it('never oversells when many requests race for the last seats', async () => {
    const SEATS = 10;
    const ATTEMPTS = 40;
    const event = await makeEvent({ totalSeats: SEATS, availableSeats: SEATS });
    const agent = await authedAgent();

    const results = await Promise.all(
      Array.from({ length: ATTEMPTS }, () => agent.post('/api/bookings').send({ eventId: event.id, seats: 1 })),
    );

    const created = results.filter((r) => r.status === 201);
    const rejected = results.filter((r) => r.status === 409);

    expect(created).toHaveLength(SEATS);
    expect(rejected).toHaveLength(ATTEMPTS - SEATS);

    const after = await Event.findById(event.id);
    expect(after?.availableSeats).toBe(0);
  });

  it('handles concurrent multi-seat bookings without dropping below zero', async () => {
    const event = await makeEvent({ totalSeats: 20, availableSeats: 20 });
    const agent = await authedAgent();

    // 15 requests × 2 seats = 30 demanded for 20 available → at most 10 succeed.
    const results = await Promise.all(
      Array.from({ length: 15 }, () => agent.post('/api/bookings').send({ eventId: event.id, seats: 2 })),
    );
    const created = results.filter((r) => r.status === 201);

    const after = await Event.findById(event.id);
    expect(after!.availableSeats).toBeGreaterThanOrEqual(0);
    // Seats sold must exactly equal seats removed from inventory.
    const seatsSold = created.reduce((sum, r) => sum + r.body.data.seats, 0);
    expect(seatsSold).toBe(20 - after!.availableSeats);
  });
});

import { AppError } from '../../lib/AppError';
import { generateBookingCode } from '../../lib/code';
import { Event } from '../events/event.model';
import { Booking, type BookingDoc } from './booking.model';
import type { CreateBookingInput, ListBookingsQuery } from './booking.schema';

const isDuplicateKey = (err: unknown): boolean =>
  typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000;

/**
 * Reserve seats for an event.
 *
 * Concurrency safety: the seat count is decremented with a single atomic
 * `findOneAndUpdate` guarded by `availableSeats >= seats`. Because the read,
 * the check, and the write happen as one atomic document operation, two
 * simultaneous requests can never oversell — at most one of them wins when only
 * a single seat remains. No transaction (and therefore no replica set) is
 * required, so this works identically on a standalone mongod, Atlas, or the
 * in-memory dev database.
 */
export async function createBooking(
  userId: string,
  input: CreateBookingInput,
): Promise<BookingDoc> {
  const { eventId, seats } = input;

  // Pre-flight checks so we can return precise, friendly error messages.
  const event = await Event.findById(eventId);
  if (!event) throw AppError.notFound('Event not found');
  if (event.isPast) throw AppError.badRequest('This event has already taken place');
  if (event.availableSeats < seats) {
    throw AppError.conflict(
      event.availableSeats === 0
        ? 'This event is sold out'
        : `Only ${event.availableSeats} seat(s) left for this event`,
    );
  }

  // Authoritative, race-safe reservation.
  const reserved = await Event.findOneAndUpdate(
    { _id: eventId, availableSeats: { $gte: seats }, date: { $gt: new Date() } },
    { $inc: { availableSeats: -seats } },
    { new: true },
  );
  if (!reserved) {
    throw AppError.conflict('Those seats were just taken — please try again');
  }

  // Persist the booking. If it fails, hand the seats back to inventory.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const booking = await Booking.create({
        user: userId,
        event: eventId,
        seats,
        bookingCode: generateBookingCode(),
      });
      return booking.populate('event');
    } catch (err) {
      if (isDuplicateKey(err) && attempt < 2) continue; // regenerate code and retry
      // eslint-disable-next-line no-await-in-loop
      await Event.updateOne({ _id: eventId }, { $inc: { availableSeats: seats } });
      throw err;
    }
  }

  await Event.updateOne({ _id: eventId }, { $inc: { availableSeats: seats } });
  throw AppError.conflict('Could not create booking, please try again');
}

export async function getUserBookings(
  userId: string,
  status: ListBookingsQuery['status'],
): Promise<BookingDoc[]> {
  const filter: Record<string, unknown> = { user: userId };
  if (status !== 'all') filter.status = status;
  return Booking.find(filter).sort({ createdAt: -1 }).populate('event');
}

/**
 * Cancel a booking and release its seats back to the event.
 *
 * The status transition is performed with an atomic `findOneAndUpdate` matching
 * `status: 'CONFIRMED'`, so a booking can only ever be cancelled once even if
 * two cancel requests race — which guarantees seats are released exactly once.
 */
export async function cancelBooking(userId: string, bookingId: string): Promise<BookingDoc> {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, user: userId, status: 'CONFIRMED' },
    { status: 'CANCELLED', cancelledAt: new Date() },
    { new: true },
  );

  if (!booking) {
    // Figure out exactly why so the client gets an accurate message.
    const existing = await Booking.findById(bookingId);
    if (!existing) throw AppError.notFound('Booking not found');
    if (String(existing.user) !== userId) throw AppError.forbidden('This booking is not yours');
    if (existing.status === 'CANCELLED') throw AppError.badRequest('This booking is already cancelled');
    throw AppError.badRequest('This booking cannot be cancelled');
  }

  // Return seats, clamped so availableSeats can never exceed capacity.
  await Event.updateOne({ _id: booking.event }, [
    {
      $set: {
        availableSeats: {
          $min: [{ $add: ['$availableSeats', booking.seats] }, '$totalSeats'],
        },
      },
    },
  ]);

  return booking.populate('event');
}

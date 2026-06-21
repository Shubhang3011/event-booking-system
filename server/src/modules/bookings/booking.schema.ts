import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const createBookingSchema = z.object({
  eventId: objectId,
  seats: z.coerce
    .number()
    .int('Seats must be a whole number')
    .min(1, 'Book at least 1 seat')
    .max(10, 'You can book at most 10 seats per booking'),
});

export const bookingIdParamSchema = z.object({ id: objectId });

export const listBookingsQuerySchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED', 'all']).default('all'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ListBookingsQuery = z.infer<typeof listBookingsQuerySchema>;

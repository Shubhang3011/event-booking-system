import { z } from 'zod';
import { EVENT_CATEGORIES } from './event.model';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event id');

export const listEventsQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.enum(EVENT_CATEGORIES).optional(),
  city: z.string().trim().max(80).optional(),
  when: z.enum(['upcoming', 'past', 'all']).default('upcoming'),
  sort: z.enum(['date', '-date', 'seats', '-seats', 'newest', '-rating', '-trending']).default('date'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const eventIdParamSchema = z.object({ id: objectId });

export const createEventSchema = z.object({
  title: z.string().trim().min(3, 'Title is too short').max(140),
  description: z.string().trim().min(10, 'Add a little more detail').max(5000),
  date: z.coerce.date().refine((d) => d.getTime() > Date.now(), 'Date must be in the future'),
  venue: z.string().trim().min(2).max(160),
  city: z.string().trim().min(2).max(80),
  category: z.enum(EVENT_CATEGORIES),
  organizer: z.string().trim().min(2).max(120),
  totalSeats: z.coerce.number().int().min(1, 'At least 1 seat').max(100000),
  imageUrl: z.union([z.string().trim().url('Enter a valid image URL').max(1000), z.literal('')]).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

import { z } from 'zod';
import { EVENT_CATEGORIES } from './event.model';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event id');

export const listEventsQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.enum(EVENT_CATEGORIES).optional(),
  city: z.string().trim().max(80).optional(),
  when: z.enum(['upcoming', 'past', 'all']).default('upcoming'),
  sort: z.enum(['date', '-date', 'seats', '-seats', 'newest']).default('date'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const eventIdParamSchema = z.object({ id: objectId });

export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;

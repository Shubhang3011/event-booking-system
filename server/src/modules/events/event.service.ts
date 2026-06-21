import type { SortOrder } from 'mongoose';
import { AppError } from '../../lib/AppError';
import { Event, type EventDoc } from './event.model';
import type { ListEventsQuery } from './event.schema';

/** Escape user input before using it inside a RegExp (prevents ReDoS/injection). */
function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SORT_MAP: Record<ListEventsQuery['sort'], Record<string, SortOrder>> = {
  date: { date: 1 },
  '-date': { date: -1 },
  seats: { availableSeats: 1 },
  '-seats': { availableSeats: -1 },
  newest: { createdAt: -1 },
};

export async function listEvents(
  query: ListEventsQuery,
): Promise<{ events: EventDoc[]; total: number }> {
  const filter: Record<string, unknown> = {};
  const now = new Date();

  if (query.when === 'upcoming') filter.date = { $gte: now };
  else if (query.when === 'past') filter.date = { $lt: now };

  if (query.category) filter.category = query.category;
  if (query.city) filter.city = new RegExp(escapeRegex(query.city), 'i');
  if (query.search) {
    const rx = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ title: rx }, { description: rx }, { venue: rx }, { city: rx }, { organizer: rx }];
  }

  const skip = (query.page - 1) * query.limit;
  const [events, total] = await Promise.all([
    Event.find(filter).sort(SORT_MAP[query.sort]).skip(skip).limit(query.limit),
    Event.countDocuments(filter),
  ]);

  return { events, total };
}

export async function getEventById(id: string): Promise<EventDoc> {
  const event = await Event.findById(id);
  if (!event) {
    throw AppError.notFound('Event not found');
  }
  return event;
}

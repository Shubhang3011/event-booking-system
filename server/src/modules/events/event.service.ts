import { Types, type SortOrder } from 'mongoose';
import { AppError } from '../../lib/AppError';
import { Booking } from '../bookings/booking.model';
import { Review } from '../reviews/review.model';
import { User } from '../users/user.model';
import { Event, type EventDoc } from './event.model';
import type { CreateEventInput, ListEventsQuery, UpdateEventInput } from './event.schema';

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
  '-rating': { ratingAverage: -1, ratingCount: -1 },
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

// ---- Saved events (bookmarks) --------------------------------------------

export async function getSavedEvents(userId: string): Promise<EventDoc[]> {
  const user = await User.findById(userId).populate<{ savedEvents: EventDoc[] }>({
    path: 'savedEvents',
    options: { sort: { date: 1 } },
  });
  if (!user) {
    throw AppError.unauthorized('Your account could not be found');
  }
  return (user.savedEvents as unknown as EventDoc[]).filter(Boolean);
}

export async function saveEvent(userId: string, eventId: string): Promise<void> {
  if (!(await Event.exists({ _id: eventId }))) {
    throw AppError.notFound('Event not found');
  }
  await User.updateOne({ _id: userId }, { $addToSet: { savedEvents: eventId } });
}

export async function unsaveEvent(userId: string, eventId: string): Promise<void> {
  await User.updateOne({ _id: userId }, { $pull: { savedEvents: eventId } });
}

// ---- Organizer CRUD -------------------------------------------------------

export async function createEvent(userId: string, input: CreateEventInput): Promise<EventDoc> {
  return Event.create({ ...input, availableSeats: input.totalSeats, createdBy: new Types.ObjectId(userId) });
}

export async function updateEvent(
  userId: string,
  id: string,
  input: UpdateEventInput,
): Promise<EventDoc> {
  const event = await Event.findById(id);
  if (!event) throw AppError.notFound('Event not found');
  if (String(event.createdBy) !== userId) {
    throw AppError.forbidden('You can only edit events you created');
  }
  // Keep availableSeats consistent if capacity changes.
  if (input.totalSeats !== undefined && input.totalSeats !== event.totalSeats) {
    const delta = input.totalSeats - event.totalSeats;
    event.availableSeats = Math.max(0, Math.min(input.totalSeats, event.availableSeats + delta));
  }
  Object.assign(event, input);
  await event.save();
  return event;
}

export async function deleteEvent(userId: string, id: string): Promise<void> {
  const event = await Event.findById(id);
  if (!event) throw AppError.notFound('Event not found');
  if (String(event.createdBy) !== userId) {
    throw AppError.forbidden('You can only delete events you created');
  }
  await Promise.all([
    Booking.deleteMany({ event: id }),
    Review.deleteMany({ event: id }),
    User.updateMany({ savedEvents: id }, { $pull: { savedEvents: id } }),
    Event.deleteOne({ _id: id }),
  ]);
}

export async function getMyEvents(userId: string): Promise<EventDoc[]> {
  return Event.find({ createdBy: userId }).sort({ date: 1 });
}

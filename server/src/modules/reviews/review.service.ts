import { AppError } from '../../lib/AppError';
import { Event } from '../events/event.model';
import { Review } from './review.model';
import type { CreateReviewInput } from './review.schema';

export interface ReviewView {
  id: string;
  rating: number;
  comment: string;
  user: string;
  userId: string;
  createdAt: Date;
}

export interface ReviewList {
  reviews: ReviewView[];
  summary: { count: number; average: number };
}

export async function listForEvent(eventId: string): Promise<ReviewList> {
  const reviews = await Review.find({ event: eventId })
    .sort({ createdAt: -1 })
    .populate<{ user: { _id: unknown; name: string } }>('user', 'name');

  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  const shaped: ReviewView[] = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    user: r.user?.name ?? 'Someone',
    userId: String(r.user?._id ?? ''),
    createdAt: r.createdAt,
  }));

  return { reviews: shaped, summary: { count, average: Math.round(average * 10) / 10 } };
}

export async function upsertReview(
  userId: string,
  eventId: string,
  input: CreateReviewInput,
): Promise<void> {
  if (!(await Event.exists({ _id: eventId }))) {
    throw AppError.notFound('Event not found');
  }
  await Review.findOneAndUpdate(
    { event: eventId, user: userId },
    { rating: input.rating, comment: input.comment ?? '' },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

export async function deleteReview(userId: string, eventId: string): Promise<void> {
  await Review.deleteOne({ event: eventId, user: userId });
}

import { Types } from 'mongoose';
import { AppError } from '../../lib/AppError';
import { Event } from '../events/event.model';
import { Review } from './review.model';
import type { CreateReviewInput } from './review.schema';

/** Recompute and persist an event's denormalized rating average + count. */
async function recomputeRating(eventId: string): Promise<void> {
  const agg = await Review.aggregate<{ _id: unknown; avg: number; count: number }>([
    { $match: { event: new Types.ObjectId(eventId) } },
    { $group: { _id: '$event', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const first = agg[0];
  await Event.updateOne(
    { _id: eventId },
    {
      ratingAverage: first ? Math.round(first.avg * 10) / 10 : 0,
      ratingCount: first ? first.count : 0,
    },
  );
}

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
  await recomputeRating(eventId);
}

export async function deleteReview(userId: string, eventId: string): Promise<void> {
  await Review.deleteOne({ event: eventId, user: userId });
  await recomputeRating(eventId);
}

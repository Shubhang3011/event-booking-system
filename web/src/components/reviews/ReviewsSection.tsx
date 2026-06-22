import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { StarRating } from '@/components/ui/StarRating';
import { useDeleteReview, useReviews, useUpsertReview } from '@/hooks/useReviews';
import { toApiError } from '@/lib/api';
import { cn } from '@/lib/cn';
import { useToast } from '@/providers/ToastProvider';

const VISIBLE_REVIEWS = 4;

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ReviewsSection({ eventId }: { eventId: string }) {
  const { user, isAuthenticated } = useAuth();
  const { data, isLoading } = useReviews(eventId);
  const upsert = useUpsertReview(eventId);
  const del = useDeleteReview(eventId);
  const toast = useToast();

  const myReview = data?.reviews.find((r) => r.userId === user?.id);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    }
  }, [myReview?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error('Pick a rating first');
      return;
    }
    try {
      await upsert.mutateAsync({ rating, comment });
      toast.success(myReview ? 'Review updated' : 'Thanks for your review');
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  const removeReview = async () => {
    try {
      await del.mutateAsync();
      setRating(0);
      setComment('');
      toast.success('Review removed');
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  const reviews = data?.reviews ?? [];
  const visible = showAll ? reviews : reviews.slice(0, VISIBLE_REVIEWS);
  const hasMore = reviews.length > VISIBLE_REVIEWS;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between gap-4 border-b border-ink pb-3">
        <h2 className="text-h2 font-semibold text-ink">Reviews</h2>
        {data && data.summary.count > 0 ? (
          <div className="flex items-center gap-2">
            <StarRating value={data.summary.average} />
            <span className="text-[13px] tabular-nums text-ink-2">
              {data.summary.average.toFixed(1)} · {data.summary.count}
            </span>
          </div>
        ) : null}
      </div>

      {isAuthenticated ? (
        <form onSubmit={submit} className="mt-6 rounded-md border border-line bg-paper-2 p-5">
          <p className="text-[11px] text-ink-2">
            {myReview ? 'Your review' : 'Leave a review'}
          </p>
          <div className="mt-3">
            <StarRating value={rating} onChange={setRating} size={26} />
          </div>
          <Textarea
            className="mt-3"
            rows={3}
            placeholder="Share a few words (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
          />
          <div className="mt-3 flex items-center justify-end gap-3">
            {myReview ? (
              <Button type="button" variant="ghost" size="sm" onClick={removeReview} isLoading={del.isPending}>
                Delete
              </Button>
            ) : null}
            <Button type="submit" size="sm" isLoading={upsert.isPending}>
              {myReview ? 'Update review' : 'Post review'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-6 text-[15px] text-ink-2">
          <Link to="/login" className="link-underline text-ink">
            Sign in
          </Link>{' '}
          to leave a review.
        </p>
      )}

      {isLoading ? (
        <p className="mt-8 text-ink-3">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-8 text-[15px] text-ink-3">No reviews yet — be the first.</p>
      ) : (
        <>
          <div className="relative">
            <div className="mt-8 space-y-6">
              {visible.map((r, i) => (
                <div
                  key={r.id}
                  className={cn(
                    'border-b border-line pb-6 last:border-b-0',
                    showAll && i >= VISIBLE_REVIEWS && 'animate-rise-in',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[11px] font-semibold text-paper-2">
                        {initials(r.user)}
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-ink">{r.user}</p>
                        <p className="text-[11px] text-ink-3">{format(new Date(r.createdAt), 'd MMM yyyy')}</p>
                      </div>
                    </div>
                    <StarRating value={r.rating} size={15} />
                  </div>
                  {r.comment ? <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{r.comment}</p> : null}
                </div>
              ))}
            </div>
            {/* Fade the last visible review into the page when collapsed. */}
            {!showAll && hasMore ? (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent"
                aria-hidden
              />
            ) : null}
          </div>

          {hasMore ? (
            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              aria-expanded={showAll}
              className="mt-5 inline-flex items-center gap-1.5 text-[12px] text-ink-2 transition-colors hover:text-ink"
            >
              {showAll ? 'Show fewer' : `Show all ${reviews.length} reviews`}
              <ChevronDown className={cn('h-4 w-4 transition-transform', showAll && 'rotate-180')} strokeWidth={1.75} />
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}

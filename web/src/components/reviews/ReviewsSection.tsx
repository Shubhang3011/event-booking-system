import { format } from 'date-fns';
import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { StarRating } from '@/components/ui/StarRating';
import { useDeleteReview, useReviews, useUpsertReview } from '@/hooks/useReviews';
import { toApiError } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

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

  // Prefill the form with the user's existing review.
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

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between gap-4 border-b border-ink pb-3">
        <h2 className="font-display text-h2 font-medium text-ink">Reviews</h2>
        {data && data.summary.count > 0 ? (
          <div className="flex items-center gap-2">
            <StarRating value={data.summary.average} />
            <span className="font-mono text-[13px] tabular-nums text-ink-2">
              {data.summary.average.toFixed(1)} · {data.summary.count}
            </span>
          </div>
        ) : null}
      </div>

      {isAuthenticated ? (
        <form onSubmit={submit} className="mt-6 rounded-md border border-line bg-paper-2 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">
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

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <p className="text-ink-3">Loading reviews…</p>
        ) : !data || data.reviews.length === 0 ? (
          <p className="text-[15px] text-ink-3">No reviews yet — be the first.</p>
        ) : (
          data.reviews.map((r) => (
            <div key={r.id} className="border-b border-line pb-6 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[11px] font-semibold text-paper-2">
                    {initials(r.user)}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{r.user}</p>
                    <p className="font-mono text-[11px] text-ink-3">{format(new Date(r.createdAt), 'd MMM yyyy')}</p>
                  </div>
                </div>
                <StarRating value={r.rating} size={15} />
              </div>
              {r.comment ? <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{r.comment}</p> : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { StarRating } from '@/components/ui/StarRating';
import { cn } from '@/lib/cn';
import { dateline } from '@/lib/format';
import type { EventItem } from '@/lib/types';
import { EventImage } from './EventImage';
import { EventStatusBadge } from './EventStatusBadge';
import { SaveButton } from './SaveButton';

/** Image-led event card — cover photo, category, clean title, rating. */
export function EventCard({ event }: { event: EventItem }) {
  const dimmed = event.isPast || event.isSoldOut;

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-line bg-paper-2 shadow-paper-1 transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-paper-2',
        dimmed && 'opacity-90',
      )}
    >
      <Link to={`/events/${event.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-paper-3">
          <EventImage event={event} className="transition-transform duration-300 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent" aria-hidden />
          <span className="absolute left-3 top-3 rounded-full bg-paper-2/90 px-2.5 py-1 text-[11px] font-medium text-ink-2 backdrop-blur-sm">
            {event.category}
          </span>
          <div className="absolute bottom-3 left-3">
            <EventStatusBadge event={event} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-[13px] font-medium text-ink-2">{dateline(event.date)}</p>
          <h3 className="mt-1 text-base font-semibold leading-snug text-ink line-clamp-2">{event.title}</h3>
          <p className="mt-1 truncate text-[13px] text-ink-3">
            {event.venue} · {event.city}
          </p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            {event.ratingCount > 0 ? (
              <span className="flex items-center gap-1.5">
                <StarRating value={event.ratingAverage} size={14} />
                <span className="text-[12px] tabular-nums text-ink-3">
                  {event.ratingAverage.toFixed(1)} ({event.ratingCount})
                </span>
              </span>
            ) : (
              <span className="text-[12px] text-ink-3">No reviews yet</span>
            )}
            <span className="text-[13px] font-semibold text-ink">Free</span>
          </div>
        </div>
      </Link>
      <SaveButton eventId={event.id} className="absolute right-3 top-3 z-10" />
    </div>
  );
}

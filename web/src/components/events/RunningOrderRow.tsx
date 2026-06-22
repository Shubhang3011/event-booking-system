import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { dateline, shortDate, time } from '@/lib/format';
import type { EventItem } from '@/lib/types';
import { EventImage } from './EventImage';
import { EventStatusBadge } from './EventStatusBadge';
import { StarRating } from '@/components/ui/StarRating';

/** Dense list row — thumbnail, date, title, venue, rating, status. */
export function RunningOrderRow({ event }: { event: EventItem; index?: number }) {
  const dimmed = event.isPast || event.isSoldOut;

  return (
    <li className="group border-b border-line last:border-b-0">
      <Link
        to={`/events/${event.id}`}
        className={cn(
          'grid grid-cols-[1fr_auto] items-center gap-4 py-4 md:grid-cols-[7rem_1fr_11rem_auto]',
          dimmed && 'opacity-70',
        )}
      >
        <span className="hidden flex-col leading-tight md:flex">
          <span className="text-[13px] font-medium text-ink">{shortDate(event.date)}</span>
          <span className="text-[13px] tabular-nums text-ink-3">{time(event.date)}</span>
        </span>
        <span className="flex min-w-0 items-center gap-3">
          <span className="hidden h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-paper-3 sm:block">
            <EventImage event={event} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold leading-tight text-ink">{event.title}</span>
            <span className="mt-0.5 block text-[12px] text-ink-3 md:hidden">{dateline(event.date)}</span>
          </span>
        </span>
        <span className="hidden truncate text-[13px] text-ink-3 md:block">
          {event.venue}, {event.city}
        </span>
        <span className="flex items-center justify-end gap-3">
          {event.ratingCount > 0 ? (
            <span className="hidden items-center gap-1 text-[13px] tabular-nums text-ink-2 sm:flex">
              <StarRating value={event.ratingAverage} size={13} />
              {event.ratingAverage.toFixed(1)}
            </span>
          ) : null}
          <EventStatusBadge event={event} />
          <ArrowRight
            className="h-4 w-4 text-ink-3 transition-all duration-150 group-hover:translate-x-1 group-hover:text-ink"
            strokeWidth={1.75}
          />
        </span>
      </Link>
    </li>
  );
}

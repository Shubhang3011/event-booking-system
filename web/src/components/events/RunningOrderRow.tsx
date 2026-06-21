import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { accentVars, eventAccent } from '@/lib/eventAccent';
import { dateline, shortDate, time } from '@/lib/format';
import type { EventItem } from '@/lib/types';
import { EventStatusBadge } from './EventStatusBadge';

/**
 * The signature layout: a real <li><a> on the events <ol>. A numbered, ruled
 * lineup (festival-timetable logic) instead of a grid of identical cards.
 */
export function RunningOrderRow({ event, index }: { event: EventItem; index: number }) {
  const dimmed = event.isPast || event.isSoldOut;

  return (
    <li style={accentVars(eventAccent(event.id))} className="group border-b border-line">
      <Link
        to={`/events/${event.id}`}
        className={cn(
          'grid grid-cols-[2.25rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[3rem_7rem_1fr_11rem_auto]',
          dimmed && 'opacity-70',
        )}
      >
        <span className="font-mono text-[13px] tabular-nums text-ink-3 transition-colors group-hover:text-[color:var(--ev-accent)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="hidden flex-col leading-tight md:flex">
          <span className="font-mono text-[12px] uppercase tracking-[0.03em] text-ink-2">{shortDate(event.date)}</span>
          <span className="font-mono text-[12px] tabular-nums text-ink-3">{time(event.date)}</span>
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-[1.4rem] font-medium leading-tight text-ink transition-transform duration-150 group-hover:translate-x-1">
            {event.title}
          </span>
          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 md:hidden">
            {dateline(event.date)}
          </span>
        </span>
        <span className="hidden truncate text-[13px] text-ink-3 md:block">
          {event.venue}, {event.city}
        </span>
        <span className="flex items-center justify-end gap-3">
          {event.ratingCount > 0 ? (
            <span className="hidden items-center gap-1 font-mono text-[12px] tabular-nums text-ink-2 sm:flex">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" strokeWidth={1.5} />
              {event.ratingAverage.toFixed(1)}
            </span>
          ) : null}
          <EventStatusBadge event={event} />
          <ArrowRight
            className="h-4 w-4 text-ink-3 transition-all duration-150 group-hover:translate-x-1 group-hover:text-[color:var(--ev-accent)]"
            strokeWidth={1.75}
          />
        </span>
      </Link>
    </li>
  );
}

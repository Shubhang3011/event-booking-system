import { isToday } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { accentVars, eventAccent } from '@/lib/eventAccent';
import { dateline } from '@/lib/format';
import type { EventItem } from '@/lib/types';
import { DateRail } from './DateRail';
import { EventStatusBadge } from './EventStatusBadge';
import { SaveButton } from './SaveButton';

/** Grid-view card: date-rail + editorial title. Hover gains weight, not lift. */
export function EventCard({ event }: { event: EventItem }) {
  const accent = eventAccent(event.id);
  const tonight = isToday(new Date(event.date)) && !event.isPast;
  const dimmed = event.isPast || event.isSoldOut;

  return (
    <div
      style={accentVars(accent)}
      className={cn(
        'group relative rounded-md border border-line bg-paper-2 shadow-paper-1 transition-all duration-150 ease-editorial hover:border-ink',
        dimmed && 'opacity-90',
      )}
    >
      <SaveButton eventId={event.id} className="absolute right-3 top-3 z-10" />
      <Link to={`/events/${event.id}`} className="flex gap-4 p-5">
        <DateRail date={event.date} accent={tonight} className="w-12 shrink-0 border-r border-line pr-4" />
        <div className="min-w-0 flex-1">
          <p className="pr-9 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">{dateline(event.date)}</p>
          <h3 className="mt-1 pr-9 font-display text-[1.35rem] font-medium leading-[1.1] text-ink line-clamp-2">
            <span className="link-underline">{event.title}</span>
          </h3>
          <p className="mt-1 truncate text-[13px] text-ink-3">
            {event.venue} · {event.city}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">
              {event.organizer}
            </span>
            <EventStatusBadge event={event} />
          </div>
        </div>
      </Link>
    </div>
  );
}

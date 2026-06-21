import { cn } from '@/lib/cn';
import { eventAccent } from '@/lib/eventAccent';
import { dateRail } from '@/lib/format';
import type { EventCategory, EventItem } from '@/lib/types';

/**
 * Deterministic, image-free "poster": a per-category texture in the event's
 * accent over warm paper. No stock photos, no AI-image look — every cover is
 * generated from the event's own data, so the index reads as a curated wall.
 */
function texture(category: EventCategory, accent: string): string {
  switch (category) {
    case 'Music':
      return `repeating-radial-gradient(circle at 82% 118%, ${accent}24 0 1px, transparent 1px 18px)`;
    case 'Technology':
    case 'Business':
      return `repeating-linear-gradient(90deg, ${accent}18 0 1px, transparent 1px 24px), repeating-linear-gradient(0deg, ${accent}14 0 1px, transparent 1px 24px)`;
    case 'Arts':
    case 'Theatre':
      return `linear-gradient(118deg, ${accent}26 0 38%, transparent 38%)`;
    case 'Sports':
      return `repeating-linear-gradient(132deg, ${accent}1c 0 2px, transparent 2px 20px)`;
    default:
      return `repeating-linear-gradient(45deg, ${accent}16 0 1px, transparent 1px 15px)`;
  }
}

interface EventCoverProps {
  event: EventItem;
  className?: string;
  showTitle?: boolean;
}

export function EventCover({ event, className, showTitle = true }: EventCoverProps) {
  const { accent } = eventAccent(event.id);
  const { day, month } = dateRail(event.date);

  return (
    <div
      className={cn('relative isolate overflow-hidden rounded-md border border-line bg-paper-3', className)}
      style={{ backgroundImage: `${texture(event.category, accent)}, linear-gradient(160deg, ${accent}14, transparent 62%)` }}
    >
      <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-ink/10 bg-paper-2/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2 backdrop-blur-sm">
        {event.category}
      </span>
      <span className="absolute right-3 top-3 font-mono text-[11px] uppercase tracking-[0.1em] tabular-nums text-ink-2">
        {day} {month}
      </span>
      {showTitle ? (
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-[1.6rem] font-medium leading-[1.05] text-ink line-clamp-3">{event.title}</h3>
        </div>
      ) : null}
    </div>
  );
}

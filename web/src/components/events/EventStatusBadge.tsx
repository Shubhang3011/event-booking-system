import { isToday } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import type { EventItem } from '@/lib/types';

/** Maps an event's derived status to an on-brand badge (never colour-only). */
export function EventStatusBadge({ event }: { event: EventItem }) {
  if (event.isPast) return <Badge tone="neutral">Past</Badge>;
  if (event.isSoldOut) return <Badge tone="neutral">Sold out</Badge>;
  if (isToday(new Date(event.date))) {
    return (
      <Badge tone="accent" withDot>
        Tonight
      </Badge>
    );
  }
  if (event.availableSeats <= 10) {
    return (
      <Badge tone="warn" withDot>
        {event.availableSeats} left
      </Badge>
    );
  }
  return (
    <Badge tone="success" withDot>
      Available
    </Badge>
  );
}

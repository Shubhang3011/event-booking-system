import { Link } from 'react-router-dom';
import { EventImage } from '@/components/events/EventImage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { dateline } from '@/lib/format';
import type { Booking } from '@/lib/types';

interface BookingCardProps {
  booking: Booking;
  onCancel: (booking: Booking) => void;
  cancelling?: boolean;
}

export function BookingCard({ booking, onCancel, cancelling = false }: BookingCardProps) {
  const { event } = booking;
  const cancelled = booking.status === 'CANCELLED';
  const past = event.isPast;
  const active = !cancelled && !past;

  return (
    <div
      className={cn(
        'flex gap-4 rounded-xl border border-line bg-paper-2 p-4 shadow-paper-1',
        (cancelled || past) && 'opacity-80',
      )}
    >
      <Link to={`/events/${event.id}`} className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-paper-3">
        <EventImage event={event} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/events/${event.id}`} className="block truncate font-semibold text-ink hover:text-accent">
              {event.title}
            </Link>
            <p className="mt-0.5 text-[13px] text-ink-2">{dateline(event.date)}</p>
            <p className="truncate text-[13px] text-ink-3">
              {event.venue}, {event.city}
            </p>
          </div>
          {cancelled ? (
            <Badge tone="danger">Cancelled</Badge>
          ) : past ? (
            <Badge tone="neutral">Past</Badge>
          ) : (
            <Badge tone="success" withDot>
              Confirmed
            </Badge>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-[13px] text-ink-2">
            {booking.seats} seat{booking.seats === 1 ? '' : 's'} ·{' '}
            <span className="tabular-nums text-ink-3">{booking.bookingCode}</span>
          </span>
          {active ? (
            <Button variant="danger" size="sm" onClick={() => onCancel(booking)} isLoading={cancelling}>
              Cancel
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

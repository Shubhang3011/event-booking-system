import { QrCode } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventImage } from '@/components/events/EventImage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { dateline } from '@/lib/format';
import type { Booking } from '@/lib/types';
import { TicketModal } from './TicketModal';

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
  const [ticketOpen, setTicketOpen] = useState(false);

  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border border-line bg-paper-2 p-3 shadow-paper-1 sm:gap-4 sm:p-4',
        (cancelled || past) && 'opacity-80',
      )}
    >
      <Link to={`/events/${event.id}`} className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-paper-3 sm:w-28">
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
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-3">
          <span className="text-[13px] text-ink-2">
            {booking.seats} seat{booking.seats === 1 ? '' : 's'} ·{' '}
            <span className="tabular-nums text-ink-3">{booking.bookingCode}</span>
          </span>
          <div className="flex items-center gap-2">
            {!cancelled ? (
              <Button variant="secondary" size="sm" onClick={() => setTicketOpen(true)}>
                <QrCode className="h-4 w-4" strokeWidth={1.75} /> Ticket
              </Button>
            ) : null}
            {active ? (
              <Button variant="danger" size="sm" onClick={() => onCancel(booking)} isLoading={cancelling}>
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <TicketModal booking={booking} open={ticketOpen} onClose={() => setTicketOpen(false)} />
    </div>
  );
}

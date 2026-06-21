import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { accentVars, eventAccent } from '@/lib/eventAccent';
import { dateline } from '@/lib/format';
import type { Booking } from '@/lib/types';
import { TicketStub } from './TicketStub';

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

  const stamp = cancelled
    ? ({ label: 'Void', tone: 'danger' } as const)
    : past
      ? ({ label: 'Used', tone: 'ink' } as const)
      : undefined;

  const footer = active ? (
    <Button variant="danger" size="sm" onClick={() => onCancel(booking)} isLoading={cancelling}>
      Cancel booking
    </Button>
  ) : (
    <Link
      to={`/events/${event.id}`}
      className="link-underline font-mono text-[12px] uppercase tracking-[0.08em] text-ink-2"
    >
      View event
    </Link>
  );

  return (
    <TicketStub
      accentStyle={accentVars(eventAccent(event.id))}
      eyebrow={dateline(event.date)}
      title={event.title}
      meta={`${event.venue}, ${event.city}`}
      seats={booking.seats}
      code={booking.bookingCode}
      stamp={stamp}
      footer={footer}
      className={cancelled || past ? 'opacity-75' : undefined}
    />
  );
}

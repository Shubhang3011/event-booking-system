import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCreateBooking } from '@/hooks/useBookings';
import { toApiError } from '@/lib/api';
import { accentVars, eventAccent } from '@/lib/eventAccent';
import { dateline } from '@/lib/format';
import type { Booking, EventItem } from '@/lib/types';
import { useToast } from '@/providers/ToastProvider';
import { TicketStub } from './TicketStub';

function Confetti({ accent }: { accent: string }) {
  const bits = [
    { left: '12%', delay: '0ms', color: accent },
    { left: '32%', delay: '120ms', color: '#EDE7D8' },
    { left: '52%', delay: '60ms', color: accent },
    { left: '70%', delay: '180ms', color: '#EDE7D8' },
    { left: '86%', delay: '90ms', color: accent },
  ];
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-1 z-10 h-0" aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute block h-3 w-2 animate-confetti rounded-[1px]"
          style={{ left: b.left, animationDelay: b.delay, background: b.color }}
        />
      ))}
    </div>
  );
}

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventItem;
  seats: number;
}

export function BookingDialog({ open, onClose, event, seats }: BookingDialogProps) {
  const accent = eventAccent(event.id);
  const toast = useToast();
  const create = useCreateBooking();
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleClose = () => {
    setBooking(null);
    create.reset();
    onClose();
  };

  const confirm = async () => {
    try {
      const result = await create.mutateAsync({ eventId: event.id, seats });
      setBooking(result);
      toast.success(`Reserved ${seats} seat${seats === 1 ? '' : 's'} · ${result.bookingCode}`);
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  // Confirmed — the one dark beat.
  if (booking) {
    return (
      <Modal open={open} onClose={handleClose} title="You're in." className="max-w-[520px]">
        <div className="relative">
          <Confetti accent={accent.accent} />
          <div style={accentVars(accent)} className="rounded-lg bg-ink-bg p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-on-ink/60">
                Booking confirmed
              </span>
              <span className="stamp animate-stamp-in text-accent">Confirmed</span>
            </div>
            <TicketStub
              variant="dark"
              pageBg="#16130F"
              accentStyle={accentVars(accent)}
              eyebrow={dateline(event.date)}
              title={event.title}
              meta={`${event.venue}, ${event.city}`}
              seats={booking.seats}
              code={booking.bookingCode}
            />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>
            Done
          </Button>
          <Link to="/bookings" onClick={handleClose}>
            <Button>View my tickets</Button>
          </Link>
        </div>
      </Modal>
    );
  }

  // Review.
  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Confirm your booking"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Back
          </Button>
          <Button variant="event" style={accentVars(accent)} onClick={confirm} isLoading={create.isPending}>
            Confirm · {seats} seat{seats === 1 ? '' : 's'}
          </Button>
        </>
      }
    >
      <div style={accentVars(accent)}>
        <TicketStub
          accentStyle={accentVars(accent)}
          eyebrow={dateline(event.date)}
          title={event.title}
          meta={`${event.venue}, ${event.city}`}
          seats={seats}
          code="LM-••••••"
        />
        <ul className="mt-4 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
          <li>· Instant confirmation</li>
          <li>· Free cancellation any time</li>
          <li>· {event.availableSeats} seats remaining</li>
        </ul>
      </div>
    </Modal>
  );
}

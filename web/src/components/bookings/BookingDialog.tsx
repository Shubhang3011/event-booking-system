import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventImage } from '@/components/events/EventImage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCreateBooking } from '@/hooks/useBookings';
import { toApiError } from '@/lib/api';
import { dateline } from '@/lib/format';
import type { Booking, EventItem } from '@/lib/types';
import { useToast } from '@/providers/ToastProvider';
import { TicketQR } from './TicketQR';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventItem;
  seats: number;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[13px]">
      <span className="text-ink-3">{label}</span>
      <span className="font-medium tabular-nums text-ink">{value}</span>
    </div>
  );
}

export function BookingDialog({ open, onClose, event, seats }: BookingDialogProps) {
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
      toast.success(`Reserved ${seats} seat${seats === 1 ? '' : 's'}`);
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  if (booking) {
    return (
      <Modal open={open} onClose={handleClose} title="You're in">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success-wash text-success">
            <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-ink">Booking confirmed</h3>
          <p className="mt-1 text-[14px] text-ink-2">{event.title}</p>
          <div className="mt-5 flex justify-center">
            <TicketQR booking={booking} />
          </div>
          <p className="mt-3 text-[13px] text-ink-3">Show this code at the entrance to check in.</p>
        </div>
        <div className="mt-4 space-y-2 rounded-lg border border-line bg-paper-3 p-4">
          <Row label="Date" value={dateline(event.date)} />
          <Row label="Seats" value={String(booking.seats)} />
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
          <Button onClick={confirm} isLoading={create.isPending}>
            Confirm · {seats} seat{seats === 1 ? '' : 's'}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-paper-3">
          <EventImage event={event} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{event.title}</p>
          <p className="mt-0.5 text-[13px] text-ink-2">{dateline(event.date)}</p>
          <p className="truncate text-[13px] text-ink-3">
            {event.venue}, {event.city}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-line bg-paper-3 px-4 py-3">
        <span className="text-[14px] text-ink-2">
          {seats} seat{seats === 1 ? '' : 's'}
        </span>
        <span className="text-[14px] font-semibold text-ink">Free</span>
      </div>
      <ul className="mt-4 space-y-1 text-[13px] text-ink-2">
        <li>· Instant confirmation</li>
        <li>· Free cancellation any time</li>
      </ul>
    </Modal>
  );
}

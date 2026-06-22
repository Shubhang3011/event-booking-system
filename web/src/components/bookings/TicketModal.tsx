import { Modal } from '@/components/ui/Modal';
import { dateline } from '@/lib/format';
import type { Booking } from '@/lib/types';
import { TicketQR } from './TicketQR';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[13px]">
      <span className="text-ink-3">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

/** Full ticket view with a scannable QR. Opened from a booking card or the
 *  confirmation flow. Cancelled tickets show a void notice instead of a QR. */
export function TicketModal({ booking, open, onClose }: { booking: Booking; open: boolean; onClose: () => void }) {
  const { event } = booking;
  const cancelled = booking.status === 'CANCELLED';
  const statusLabel = cancelled ? 'Cancelled' : event.isPast ? 'Past' : 'Confirmed';

  return (
    <Modal open={open} onClose={onClose} title="Your ticket">
      <div className="flex flex-col items-center text-center">
        <p className="text-[13px] font-medium text-ink-2">{dateline(event.date)}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug text-ink">{event.title}</h3>
        <p className="mt-0.5 text-[13px] text-ink-3">
          {event.venue}, {event.city}
        </p>

        {cancelled ? (
          <p className="mt-5 w-full rounded-lg border border-danger/30 bg-danger-wash px-4 py-6 text-[14px] text-danger">
            This ticket was cancelled and is no longer valid for entry.
          </p>
        ) : (
          <>
            <div className="mt-5">
              <TicketQR booking={booking} />
            </div>
            <p className="mt-3 text-[13px] text-ink-3">Show this code at the entrance to check in.</p>
          </>
        )}

        <dl className="mt-5 w-full max-w-xs space-y-2 border-t border-line pt-4 text-left">
          <Row label="Seats" value={`${booking.seats} seat${booking.seats === 1 ? '' : 's'}`} />
          <Row label="Status" value={statusLabel} />
        </dl>
      </div>
    </Modal>
  );
}

import { QRCodeSVG } from 'qrcode.react';
import type { Booking } from '@/lib/types';

const FALLBACK_ORIGIN = 'https://linemate-app.onrender.com';

/** Data encoded in a ticket's QR: a deep link to the event carrying the booking
 *  code, so staff scanning it land on the right event with the reference to
 *  check off. Self-contained — needs no scanning backend. */
export function ticketPayload(booking: Booking): string {
  const origin =
    typeof window !== 'undefined' && window.location?.origin ? window.location.origin : FALLBACK_ORIGIN;
  return `${origin}/events/${booking.event.id}?ticket=${encodeURIComponent(booking.bookingCode)}`;
}

/** Scannable QR for a ticket. Always dark-on-white inside a white card so it
 *  scans reliably even in dark mode — the white quiet zone is part of the spec. */
export function TicketQR({ booking, size = 176 }: { booking: Booking; size?: number }) {
  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-xl bg-white p-5 ring-1 ring-zinc-200">
      <QRCodeSVG
        value={ticketPayload(booking)}
        size={size}
        bgColor="#ffffff"
        fgColor="#111827"
        level="M"
        title={`Ticket QR code for booking ${booking.bookingCode}`}
      />
      <span className="font-mono text-sm font-semibold tracking-[0.25em] text-zinc-900">{booking.bookingCode}</span>
    </div>
  );
}

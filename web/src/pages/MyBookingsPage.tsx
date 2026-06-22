import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingCard } from '@/components/bookings/BookingCard';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBookings, useCancelBooking } from '@/hooks/useBookings';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { toApiError } from '@/lib/api';
import { cn } from '@/lib/cn';
import { dateline } from '@/lib/format';
import type { Booking } from '@/lib/types';
import { useToast } from '@/providers/ToastProvider';

type Tab = 'upcoming' | 'past' | 'cancelled';

export function MyBookingsPage() {
  useDocumentTitle('My Tickets');
  const { data: bookings, isLoading, isError } = useBookings();
  const cancelMutation = useCancelBooking();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>('upcoming');
  const [target, setTarget] = useState<Booking | null>(null);

  const groups = useMemo(() => {
    const all = bookings ?? [];
    return {
      upcoming: all.filter((b) => b.status === 'CONFIRMED' && !b.event.isPast),
      past: all.filter((b) => b.status === 'CONFIRMED' && b.event.isPast),
      cancelled: all.filter((b) => b.status === 'CANCELLED'),
    };
  }, [bookings]);

  const list = groups[tab];

  const confirmCancel = async () => {
    if (!target) return;
    try {
      await cancelMutation.mutateAsync(target.id);
      toast.success('Booking cancelled — seats released');
      setTarget(null);
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: groups.upcoming.length },
    { key: 'past', label: 'Past', count: groups.past.length },
    { key: 'cancelled', label: 'Cancelled', count: groups.cancelled.length },
  ];

  return (
    <Container className="py-8 sm:py-12">
      <header className="flex items-end justify-between gap-4">
        <h1 className="text-h1 font-semibold text-ink">My Tickets</h1>
        <span className="text-[12px] text-ink-3">
          {(bookings ?? []).length} total
        </span>
      </header>

      {/* Editorial underlined tabs */}
      <div className="mt-6 flex gap-7 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key ? 'true' : undefined}
            className={cn(
              'relative -mb-px flex items-center gap-2 pb-3 text-[15px] transition-colors',
              tab === t.key ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
            )}
          >
            {t.label}
            <span className="text-[11px] tabular-nums text-ink-3">{t.count}</span>
            {tab === t.key ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" /> : null}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {isError ? (
          <p className="text-[13px] text-danger">Could not load your bookings. Please refresh.</p>
        ) : isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-md" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyTickets tab={tab} />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {list.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={setTarget}
                cancelling={cancelMutation.isPending && target?.id === booking.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirmation (the void modal) */}
      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title="Cancel this booking?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTarget(null)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={confirmCancel} isLoading={cancelMutation.isPending}>
              Cancel booking
            </Button>
          </>
        }
      >
        {target ? (
          <div>
            <p className="text-[11px] text-ink-3">{dateline(target.event.date)}</p>
            <p className="mt-1 text-[1.4rem] font-medium leading-tight text-ink">{target.event.title}</p>
            <p className="mt-1 text-[13px] text-ink-3">
              {target.seats} seat{target.seats === 1 ? '' : 's'} · {target.bookingCode}
            </p>
            <p className="mt-4 text-[14px] text-ink-2">
              This releases your {target.seats} seat{target.seats === 1 ? '' : 's'} back to the event. This cannot be
              undone.
            </p>
          </div>
        ) : null}
      </Modal>
    </Container>
  );
}

function EmptyTickets({ tab }: { tab: Tab }) {
  const copy: Record<Tab, string> = {
    upcoming: 'Your stub drawer is empty.',
    past: 'No past tickets yet.',
    cancelled: 'Nothing cancelled — nice.',
  };
  return (
    <div className="flex flex-col items-center gap-5 rounded-md border border-dashed border-line-strong bg-paper-2 px-6 py-16 text-center">
      <div className="flex h-16 w-28 items-center justify-center rounded-md border border-dashed border-line-strong text-ink-3" aria-hidden>
        <span className="h-full w-px border-l border-dashed border-line-strong" />
      </div>
      <p className="text-[1.35rem] text-ink-2">{copy[tab]}</p>
      {tab === 'upcoming' ? (
        <Link to="/events">
          <Button>Browse events</Button>
        </Link>
      ) : null}
    </div>
  );
}

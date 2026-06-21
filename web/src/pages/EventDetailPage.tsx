import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { BookingDialog } from '@/components/bookings/BookingDialog';
import { EventCover } from '@/components/events/EventCover';
import { EventStatusBadge } from '@/components/events/EventStatusBadge';
import { RunningOrderRow } from '@/components/events/RunningOrderRow';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { SeatStepper } from '@/components/ui/SeatStepper';
import { Skeleton } from '@/components/ui/Skeleton';
import { useEvent, useEvents } from '@/hooks/useEvents';
import { accentVars, eventAccent } from '@/lib/eventAccent';
import { longDate, padCount, time } from '@/lib/format';
import type { EventItem } from '@/lib/types';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{label}</dt>
      <dd className="text-right text-[14px] text-ink">{value}</dd>
    </div>
  );
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = useEvent(id);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !event) return <NotFound />;

  return <EventDetail event={event} />;
}

function EventDetail({ event }: { event: EventItem }) {
  const { isAuthenticated } = useAuth();
  const accent = eventAccent(event.id);
  const max = Math.min(10, event.availableSeats);
  const [seats, setSeats] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const bookable = !event.isPast && !event.isSoldOut;

  // "More like this" — same category, excluding this event.
  const { data: related } = useEvents({ category: event.category, when: 'upcoming', sort: 'date', limit: 5 });
  const moreLikeThis = (related?.data ?? []).filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <Container className="py-10" >
      <Link to="/events" className="link-underline inline-flex items-center gap-1.5 text-[13px] text-ink-2">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All events
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: editorial */}
        <div style={accentVars(accent)}>
          <EventCover event={event} className="aspect-[16/9] w-full" showTitle={false} />

          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.14em] text-[color:var(--ev-accent)]">
            {event.category}
          </p>
          <h1 className="mt-2 font-display text-display font-medium leading-tight text-ink">{event.title}</h1>

          <dl className="mt-6 max-w-md">
            <Fact label="Date" value={longDate(event.date)} />
            <Fact label="Doors" value={time(event.date)} />
            <Fact label="Venue" value={event.venue} />
            <Fact label="City" value={event.city} />
            <Fact label="Organizer" value={event.organizer} />
          </dl>

          <div className="mt-8 max-w-prose">
            <p className="text-body-lg leading-relaxed text-ink-2">{event.description}</p>
          </div>
        </div>

        {/* Right: sticky booking panel */}
        <div>
          <div
            style={accentVars(accent)}
            className="sticky top-24 overflow-hidden rounded-md border border-line bg-paper-2 shadow-paper-1"
          >
            <div className="h-1 w-full bg-[color:var(--ev-accent)]" aria-hidden />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-h2 font-medium text-ink">Free</span>
                <EventStatusBadge event={event} />
              </div>
              <p className="mt-1 text-[13px] text-ink-3">Reserved seating · no charge</p>

              {/* Departure-board seats counter */}
              <div className="mt-5 flex items-center gap-3 rounded-sm bg-ink-bg px-3 py-2.5 text-paper-on-ink">
                <span className="font-mono text-xl tabular-nums">{padCount(event.availableSeats)}</span>
                <span className="font-mono text-[11px] uppercase leading-tight tracking-[0.12em] text-paper-on-ink/65">
                  seats
                  <br />
                  left of {event.totalSeats}
                </span>
              </div>

              {bookable ? (
                <>
                  <div className="mt-6">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">How many seats?</p>
                    <SeatStepper value={seats} onChange={setSeats} min={1} max={max} />
                  </div>

                  <div className="mt-6">
                    {isAuthenticated ? (
                      <Button
                        variant="event"
                        fullWidth
                        style={accentVars(accent)}
                        onClick={() => setDialogOpen(true)}
                      >
                        Reserve {seats} seat{seats === 1 ? '' : 's'}
                      </Button>
                    ) : (
                      <Link to="/login" state={{ from: `/events/${event.id}` }} className="block">
                        <Button variant="event" fullWidth style={accentVars(accent)}>
                          Sign in to reserve
                        </Button>
                      </Link>
                    )}
                  </div>

                  <ul className="mt-4 space-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    <li>· Instant confirmation</li>
                    <li>· Free cancellation any time</li>
                  </ul>
                </>
              ) : (
                <div className="mt-6">
                  <Button variant="secondary" fullWidth disabled>
                    {event.isPast ? 'This event has ended' : 'Sold out'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {moreLikeThis.length > 0 ? (
        <section className="mt-16">
          <h2 className="border-b border-ink pb-3 font-display text-h2 font-medium text-ink">More like this</h2>
          <ol>
            {moreLikeThis.map((e, i) => (
              <RunningOrderRow key={e.id} event={e} index={i} />
            ))}
          </ol>
        </section>
      ) : null}

      {bookable ? (
        <BookingDialog open={dialogOpen} onClose={() => setDialogOpen(false)} event={event} seats={seats} />
      ) : null}
    </Container>
  );
}

function DetailSkeleton() {
  return (
    <Container className="py-10">
      <Skeleton className="h-4 w-24" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Skeleton className="aspect-[16/9] w-full" />
          <Skeleton className="mt-6 h-4 w-28" />
          <Skeleton className="mt-3 h-12 w-[80%]" />
          <div className="mt-6 max-w-md space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-md" />
      </div>
    </Container>
  );
}

function NotFound() {
  return (
    <Container className="grid min-h-[50vh] place-items-center py-20 text-center">
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-3">Not found</p>
        <h1 className="mt-3 font-display text-h1 font-medium text-ink">We couldn't find that event</h1>
        <p className="mt-3 text-ink-2">It may have been removed or the link is wrong.</p>
        <Link to="/events" className="mt-6 inline-block">
          <Button>Browse events</Button>
        </Link>
      </div>
    </Container>
  );
}

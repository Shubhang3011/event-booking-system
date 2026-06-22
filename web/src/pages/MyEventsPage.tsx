import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/events/EventSkeletons';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMyEvents } from '@/hooks/useEventMutations';

export function MyEventsPage() {
  useDocumentTitle('My events');
  const { data: events, isLoading } = useMyEvents();

  return (
    <Container className="py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-h1 font-medium text-ink">My events</h1>
          <p className="mt-1 text-ink-2">Events you've created. Open one to edit or delete it.</p>
        </div>
        <Link to="/events/new">
          <Button>
            <Plus className="h-4 w-4" strokeWidth={2} /> Create event
          </Button>
        </Link>
      </header>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : !events || events.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-md border border-dashed border-line-strong bg-paper-2 px-6 py-16 text-center">
            <p className="font-display text-[1.35rem] italic text-ink-2">You haven't created any events yet.</p>
            <Link to="/events/new">
              <Button>Create your first event</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="space-y-2">
                <EventCard event={event} />
                <div className="flex items-center justify-between gap-2 px-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
                  <span className="tabular-nums">
                    {event.viewCount} views · {event.bookingCount} booked
                  </span>
                  <Link to={`/events/${event.id}/edit`} className="text-ink-2 transition-colors hover:text-ink">
                    <span className="link-underline">Edit</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

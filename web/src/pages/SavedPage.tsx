import { Link } from 'react-router-dom';
import { EventCard } from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/events/EventSkeletons';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useSavedEvents } from '@/hooks/useSaved';

export function SavedPage() {
  useDocumentTitle('Saved events');
  const { data: events, isLoading } = useSavedEvents();

  return (
    <Container className="py-12">
      <header className="flex items-end justify-between gap-4">
        <h1 className="text-h1 font-semibold text-ink">Saved events</h1>
        {events ? <span className="text-[12px] text-ink-3">{events.length} saved</span> : null}
      </header>
      <p className="mt-1 text-ink-2">Events you’ve bookmarked to come back to.</p>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : !events || events.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-md border border-dashed border-line-strong bg-paper-2 px-6 py-16 text-center">
            <p className="text-[1.35rem] text-ink-2">Nothing saved yet.</p>
            <p className="max-w-[40ch] text-[14px] text-ink-3">
              Tap the bookmark on any event to keep it here for later.
            </p>
            <Link to="/events">
              <Button>Browse events</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

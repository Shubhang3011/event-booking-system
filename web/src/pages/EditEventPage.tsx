import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { EventForm } from '@/components/events/EventForm';
import { Container } from '@/components/layout/Container';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useEvent } from '@/hooks/useEvents';
import { useUpdateEvent } from '@/hooks/useEventMutations';
import { toApiError } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

/** ISO string -> "YYYY-MM-DDTHH:mm" in local time for the datetime-local input. */
function toLocalDatetime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditEventPage() {
  useDocumentTitle('Edit event');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: event, isLoading } = useEvent(id);
  const navigate = useNavigate();
  const toast = useToast();
  const update = useUpdateEvent(id ?? '');

  if (isLoading) {
    return (
      <Container className="py-12">
        <p className="text-ink-3">Loading…</p>
      </Container>
    );
  }
  if (!event) return <Navigate to="/events" replace />;
  if (event.createdBy !== user?.id) return <Navigate to={`/events/${event.id}`} replace />;

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl">
        <p className="text-[12px] text-ink-3">Organizer</p>
        <h1 className="mt-3 text-h1 font-semibold text-ink">Edit event</h1>
        <div className="mt-8">
          <EventForm
            submitLabel="Save changes"
            defaultValues={{
              title: event.title,
              description: event.description,
              date: toLocalDatetime(event.date),
              venue: event.venue,
              city: event.city,
              category: event.category,
              organizer: event.organizer,
              totalSeats: event.totalSeats,
            }}
            onSubmit={async (values) => {
              try {
                await update.mutateAsync(values);
                toast.success('Event updated');
                navigate(`/events/${event.id}`);
              } catch (err) {
                toast.error(toApiError(err).message);
              }
            }}
          />
        </div>
      </div>
    </Container>
  );
}

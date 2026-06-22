import { useNavigate } from 'react-router-dom';
import { EventForm } from '@/components/events/EventForm';
import { Container } from '@/components/layout/Container';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCreateEvent } from '@/hooks/useEventMutations';
import { toApiError } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

export function CreateEventPage() {
  useDocumentTitle('Create event');
  const navigate = useNavigate();
  const toast = useToast();
  const create = useCreateEvent();

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl">
        <p className="text-[12px] text-ink-3">Organizer</p>
        <h1 className="mt-3 text-h1 font-semibold text-ink">Create an event</h1>
        <p className="mt-2 text-ink-2">Publish an event for people to discover and book.</p>
        <div className="mt-8">
          <EventForm
            submitLabel="Publish event"
            onSubmit={async (values) => {
              try {
                const event = await create.mutateAsync(values);
                toast.success('Event published');
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

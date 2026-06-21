import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/auth/AuthContext';
import { eventsApi, type EventInput } from '@/lib/api';

export function useMyEvents() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['my-events'],
    queryFn: () => eventsApi.listMine(),
    enabled: isAuthenticated,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return (id?: string) => {
    qc.invalidateQueries({ queryKey: ['events'] });
    qc.invalidateQueries({ queryKey: ['my-events'] });
    if (id) qc.invalidateQueries({ queryKey: ['event', id] });
  };
}

export function useCreateEvent() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: EventInput) => eventsApi.create(body),
    onSuccess: () => invalidate(),
  });
}

export function useUpdateEvent(id: string) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (body: Partial<EventInput>) => eventsApi.update(id, body),
    onSuccess: () => invalidate(id),
  });
}

export function useDeleteEvent() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => eventsApi.remove(id),
    onSuccess: () => invalidate(),
  });
}

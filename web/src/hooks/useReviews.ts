import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api';

export function useReviews(eventId: string) {
  return useQuery({
    queryKey: ['reviews', eventId],
    queryFn: () => eventsApi.listReviews(eventId),
  });
}

export function useUpsertReview(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { rating: number; comment: string }) => eventsApi.upsertReview(eventId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', eventId] }),
  });
}

export function useDeleteReview(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => eventsApi.deleteReview(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', eventId] }),
  });
}

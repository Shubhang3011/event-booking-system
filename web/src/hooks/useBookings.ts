import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, type CreateBookingPayload } from '@/lib/api';
import type { BookingStatus } from '@/lib/types';

export function useBookings(status?: BookingStatus) {
  return useQuery({
    queryKey: ['bookings', status ?? 'all'],
    queryFn: () => bookingsApi.list(status),
  });
}

/** Invalidate everything a booking change can affect (lists + event seat counts). */
function useInvalidateAfterBooking() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['bookings'] });
    qc.invalidateQueries({ queryKey: ['events'] });
    qc.invalidateQueries({ queryKey: ['event'] });
  };
}

export function useCreateBooking() {
  const invalidate = useInvalidateAfterBooking();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingsApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useCancelBooking() {
  const invalidate = useInvalidateAfterBooking();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: invalidate,
  });
}

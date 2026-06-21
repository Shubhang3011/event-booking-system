import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { eventsApi, type ListEventsParams } from '@/lib/api';

export function useEvents(params: ListEventsParams) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

/** Paginated events feed with a "Load more" cursor. */
export function useInfiniteEvents(params: Omit<ListEventsParams, 'page'>) {
  return useInfiniteQuery({
    // Key starts with 'events' so booking mutations (which invalidate ['events'])
    // also refresh the feed's seat counts.
    queryKey: ['events', 'infinite', params],
    queryFn: ({ pageParam }) => eventsApi.list({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.get(id as string),
    enabled: Boolean(id),
  });
}

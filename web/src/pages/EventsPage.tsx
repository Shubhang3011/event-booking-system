import { ChevronDown, LayoutGrid, List, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Container } from '@/components/layout/Container';
import { EventCard } from '@/components/events/EventCard';
import { EventCardSkeleton, RunningOrderSkeleton } from '@/components/events/EventSkeletons';
import { RunningOrderRow } from '@/components/events/RunningOrderRow';
import { Button } from '@/components/ui/Button';
import { FilterPill } from '@/components/ui/FilterPill';
import { Select } from '@/components/ui/Input';
import { useInfiniteEvents } from '@/hooks/useEvents';
import type { ListEventsParams } from '@/lib/api';
import { cn } from '@/lib/cn';
import { EVENT_CATEGORIES, type EventCategory } from '@/lib/types';

type When = 'upcoming' | 'past' | 'all';
type SortKey = NonNullable<ListEventsParams['sort']>;
type View = 'list' | 'grid';

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'date', label: 'Date — soonest' },
  { value: '-trending', label: 'Trending' },
  { value: '-rating', label: 'Top rated' },
  { value: 'newest', label: 'Recently added' },
  { value: '-seats', label: 'Most seats left' },
];

const WHENS: { value: When; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'all', label: 'All' },
  { value: 'past', label: 'Past' },
];

export function EventsPage() {
  useDocumentTitle('Events');
  const [params, setParams] = useSearchParams();

  const category = (params.get('category') as EventCategory | null) ?? undefined;
  const when = (params.get('when') as When | null) ?? 'upcoming';
  const sort = (params.get('sort') as SortKey | null) ?? 'date';
  const view = (params.get('view') as View | null) ?? 'grid';
  const q = params.get('q') ?? '';

  const update = useCallback(
    (key: string, value: string | null) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value == null || value === '') next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  // Debounced search → URL.
  const [searchInput, setSearchInput] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => update('q', searchInput || null), 300);
    return () => clearTimeout(t);
  }, [searchInput, update]);

  const queryParams = useMemo<Omit<ListEventsParams, 'page'>>(
    () => ({ search: q || undefined, category, when, sort, limit: 12 }),
    [q, category, when, sort],
  );

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteEvents(queryParams);

  const events = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;
  const hasFilters = Boolean(q || category || when !== 'upcoming');

  const clearFilters = () => {
    setSearchInput('');
    setParams({}, { replace: true });
  };

  return (
    <>
      {/* Sticky filter sub-bar */}
      <div className="sticky top-16 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
        <Container className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
          <p className="text-[12px] text-ink-3">
            <span className="tabular-nums text-ink">{total}</span> {total === 1 ? 'event' : 'events'}
          </p>

          <div className="relative min-w-[12rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search events, venues, cities…"
              aria-label="Search events"
              className="h-9 w-full rounded-sm border border-line bg-paper-2 pl-9 pr-3 text-[14px] text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="hidden text-[11px] text-ink-3 sm:block">
                Sort
              </label>
              <div className="relative">
                <Select
                  id="sort"
                  value={sort}
                  onChange={(e) => update('sort', e.target.value)}
                  className="h-9 w-auto bg-paper-2 pr-8 text-[13px]"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3"
                  strokeWidth={2}
                />
              </div>
            </div>

            <div className="flex items-center rounded-sm border border-line" role="group" aria-label="View mode">
              {([
                { value: 'list', Icon: List, label: 'List view' },
                { value: 'grid', Icon: LayoutGrid, label: 'Grid view' },
              ] as const).map(({ value, Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-label={label}
                  aria-pressed={view === value}
                  onClick={() => update('view', value)}
                  className={cn(
                    'grid h-9 w-9 place-items-center transition-colors',
                    view === value ? 'bg-ink text-paper-2' : 'text-ink-3 hover:text-ink',
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 overflow-x-auto pb-1">
            <FilterPill active={!category} onClick={() => update('category', null)}>
              All
            </FilterPill>
            {EVENT_CATEGORIES.map((c) => (
              <FilterPill key={c} active={category === c} onClick={() => update('category', category === c ? null : c)}>
                {c}
              </FilterPill>
            ))}
            <span className="mx-1 h-4 w-px bg-line" aria-hidden />
            {WHENS.map((w) => (
              <FilterPill key={w.value} active={when === w.value} onClick={() => update('when', w.value)}>
                {w.label}
              </FilterPill>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-10">
        {isError ? (
          <ErrorState onRetry={() => fetchNextPage()} />
        ) : isLoading ? (
          view === 'list' ? (
            <RunningOrderSkeleton rows={7} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          )
        ) : events.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        ) : view === 'list' ? (
          <ol>
            {events.map((event, i) => (
              <RunningOrderRow key={event.id} event={event} index={i} />
            ))}
          </ol>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {hasNextPage ? (
          <div className="mt-10 flex justify-center">
            <Button variant="secondary" onClick={() => fetchNextPage()} isLoading={isFetchingNextPage}>
              Load more →
            </Button>
          </div>
        ) : null}
      </Container>
    </>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-md border border-dashed border-line-strong bg-paper-2 px-6 py-16 text-center">
      <p className="text-[12px] text-ink-3">
        {hasFilters ? 'No events match. Loosen the filters.' : 'No events yet.'}
      </p>
      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-md border border-danger/30 bg-danger-wash/40 px-6 py-16 text-center">
      <p className="text-[12px] text-danger">Could not load events</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

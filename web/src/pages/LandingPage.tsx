import { ArrowRight, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EventCard } from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/events/EventSkeletons';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useEvents } from '@/hooks/useEvents';
import { categoryImage } from '@/lib/coverImage';
import { EVENT_CATEGORIES } from '@/lib/types';

const POPULAR = ['Music', 'Technology', 'Food & Drink', 'Arts', 'Wellness'] as const;

function HeroSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/events?q=${encodeURIComponent(q.trim())}` : '/events');
  };
  return (
    <form onSubmit={submit} className="mt-8 flex w-full max-w-xl gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search events, venues, cities…"
          aria-label="Search events"
          className="h-12 w-full rounded-lg border border-line bg-paper-2 pl-12 pr-4 text-[15px] text-ink shadow-paper-1 placeholder:text-ink-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
        />
      </div>
      <Button type="submit" size="md" className="h-12 px-6">
        Search
      </Button>
    </form>
  );
}

function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {EVENT_CATEGORIES.map((c) => (
        <Link
          key={c}
          to={`/events?category=${encodeURIComponent(c)}`}
          className="group relative aspect-[5/2] overflow-hidden rounded-lg border border-line"
        >
          <img
            src={categoryImage(c)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" aria-hidden />
          <span className="absolute bottom-3 left-4 text-[1.05rem] font-semibold text-white">{c}</span>
        </Link>
      ))}
    </div>
  );
}

export function LandingPage() {
  const { data: trending, isLoading: loadingTrending } = useEvents({ when: 'upcoming', sort: '-trending', limit: 6 });
  const { data: upcoming, isLoading: loadingUpcoming } = useEvents({ when: 'upcoming', sort: 'date', limit: 8 });

  const trendingEvents = trending?.data ?? [];
  const upcomingEvents = upcoming?.data ?? [];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="py-16 md:py-24">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-3">Linemate · Live events in India</p>
          <h1 className="font-wonk mt-4 max-w-[16ch] font-display text-display-xl font-medium text-ink">
            Find your next <span className="italic text-accent">night out.</span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-body-lg text-ink-2">
            Gigs, talks, long dinners and late nights — discover what's on near you and book a seat in seconds.
          </p>
          <HeroSearch />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">Popular:</span>
            {POPULAR.map((c) => (
              <Link
                key={c}
                to={`/events?category=${encodeURIComponent(c)}`}
                className="rounded-full border border-line bg-paper-2 px-3 py-1 text-[13px] text-ink-2 transition-colors hover:border-ink hover:text-ink"
              >
                {c}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Trending */}
      <section className="py-14 md:py-16">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-h2 font-medium text-ink">Trending this week</h2>
              <p className="mt-1 text-[14px] text-ink-2">The events filling up fastest right now.</p>
            </div>
            <Link to="/events?sort=-trending" className="link-underline inline-flex items-center gap-1.5 text-[14px] text-ink-2">
              See all <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loadingTrending
              ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
              : trendingEvents.slice(0, 6).map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="border-y border-line bg-paper-3/40 py-14 md:py-16">
        <Container>
          <h2 className="font-display text-h2 font-medium text-ink">Browse by category</h2>
          <div className="mt-6">
            <CategoryTiles />
          </div>
        </Container>
      </section>

      {/* Upcoming */}
      <section className="py-14 md:py-16">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-h2 font-medium text-ink">Happening soon</h2>
            <Link to="/events" className="link-underline inline-flex items-center gap-1.5 text-[14px] text-ink-2">
              All events <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loadingUpcoming
              ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
              : upcomingEvents.slice(0, 8).map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </Container>
      </section>
    </>
  );
}

import { ArrowRight, MapPin, RotateCcw, Search, Sparkles, Ticket, Zap } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EventCard } from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/events/EventSkeletons';
import { EventImage } from '@/components/events/EventImage';
import { Container } from '@/components/layout/Container';
import { useEvents } from '@/hooks/useEvents';
import { categoryImage } from '@/lib/coverImage';
import { dateline } from '@/lib/format';
import type { EventItem } from '@/lib/types';
import { EVENT_CATEGORIES } from '@/lib/types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=70';
const POPULAR = ['Music', 'Technology', 'Food & Drink', 'Arts', 'Wellness'] as const;

function HeroSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/events?q=${encodeURIComponent(q.trim())}` : '/events');
  };
  return (
    <form onSubmit={submit} className="mt-7 flex w-full max-w-xl gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" strokeWidth={1.75} />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search events, venues, cities…"
          aria-label="Search events"
          className="h-12 w-full rounded-xl bg-transparent pl-11 pr-3 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="h-12 shrink-0 rounded-xl bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-press"
      >
        Search
      </button>
    </form>
  );
}

function FeaturedCard({ event }: { event: EventItem }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="group mt-6 grid overflow-hidden rounded-2xl border border-line bg-paper-2 shadow-paper-1 transition-shadow hover:shadow-paper-2 md:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-3 md:aspect-auto md:min-h-[20rem]">
        <EventImage event={event} className="transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
          <Sparkles className="h-3.5 w-3.5" /> Trending
        </span>
      </div>
      <div className="flex flex-col justify-center p-6 md:p-8">
        <p className="text-[13px] font-medium text-ink-2">{dateline(event.date)}</p>
        <h3 className="mt-2 text-2xl font-bold leading-tight text-ink md:text-3xl">{event.title}</h3>
        <p className="mt-3 line-clamp-2 text-ink-2">{event.description}</p>
        <p className="mt-3 text-[14px] text-ink-3">
          {event.venue}, {event.city}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-accent">
          View event <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

const TRUST = [
  [Ticket, 'Free to book'],
  [Zap, 'Instant confirmation'],
  [RotateCcw, 'Free cancellation'],
  [MapPin, 'Events across India'],
] as const;

function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {EVENT_CATEGORIES.map((c) => (
        <Link
          key={c}
          to={`/events?category=${encodeURIComponent(c)}`}
          className="group relative aspect-[3/2] overflow-hidden rounded-xl"
        >
          <img
            src={categoryImage(c)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden />
          <span className="absolute bottom-3 left-4 text-[1.05rem] font-semibold text-white">{c}</span>
        </Link>
      ))}
    </div>
  );
}

export function LandingPage() {
  const { data: trending, isLoading: loadingTrending } = useEvents({ when: 'upcoming', sort: '-trending', limit: 7 });
  const { data: upcoming, isLoading: loadingUpcoming } = useEvents({ when: 'upcoming', sort: 'date', limit: 8 });

  const trendingEvents = trending?.data ?? [];
  const featured = trendingEvents[0];
  const trendingRest = trendingEvents.slice(1, 7);
  const upcomingEvents = upcoming?.data ?? [];

  return (
    <>
      {/* Immersive hero */}
      <section className="relative isolate overflow-hidden">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" aria-hidden />
        <Container className="relative py-16 sm:py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[13px] font-medium text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Live events across India
          </span>
          <h1 className="mt-5 max-w-[18ch] text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            Find your next night out.
          </h1>
          <p className="mt-4 max-w-[48ch] text-lg text-white/80">
            Gigs, talks, long dinners and late nights — discover what's on near you and book a seat in seconds.
          </p>
          <HeroSearch />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {POPULAR.map((c) => (
              <Link
                key={c}
                to={`/events?category=${encodeURIComponent(c)}`}
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                {c}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust band */}
      <section className="border-b border-line bg-paper-2">
        <Container>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 py-6 sm:grid-cols-4">
            {TRUST.map(([Icon, label]) => (
              <div key={label} className="flex items-center justify-center gap-2.5 text-[14px] font-medium text-ink-2">
                <Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
                {label}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Trending */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-h2 font-bold text-ink">Trending this week</h2>
              <p className="mt-1 text-[14px] text-ink-2">The events filling up fastest right now.</p>
            </div>
            <Link to="/events?sort=-trending" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-accent hover:text-accent-press">
              See all <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
          {loadingTrending ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {featured ? <FeaturedCard event={featured} /> : null}
              {trendingRest.length > 0 ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {trendingRest.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </Container>
      </section>

      {/* Categories */}
      <section className="border-y border-line bg-paper-3/40 py-12 md:py-16">
        <Container>
          <h2 className="text-h2 font-bold text-ink">Browse by category</h2>
          <p className="mt-1 text-[14px] text-ink-2">Find your scene.</p>
          <div className="mt-6">
            <CategoryTiles />
          </div>
        </Container>
      </section>

      {/* Upcoming */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-h2 font-bold text-ink">Happening soon</h2>
            <Link to="/events" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-accent hover:text-accent-press">
              All events <ArrowRight className="h-4 w-4" strokeWidth={2} />
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

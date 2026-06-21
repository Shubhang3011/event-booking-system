import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RunningOrderRow } from '@/components/events/RunningOrderRow';
import { RunningOrderSkeleton } from '@/components/events/EventSkeletons';
import { Container } from '@/components/layout/Container';
import { TicketStub } from '@/components/bookings/TicketStub';
import { Button } from '@/components/ui/Button';
import { useEvents } from '@/hooks/useEvents';
import { accentVars } from '@/lib/eventAccent';
import { EVENT_CATEGORIES } from '@/lib/types';

const STEPS = [
  ['01', 'Browse the running order', "Scan tonight's lineup or filter by city, date and mood — no endless scroll."],
  ['02', 'Reserve your seats', 'Choose how many seats and confirm. Inventory updates instantly, so it never oversells.'],
  ['03', 'Keep your stub', 'Your ticket lands in My Tickets with a code and barcode. Cancel any time and the seats go back.'],
] as const;

export function LandingPage() {
  const { data, isLoading } = useEvents({ when: 'upcoming', sort: 'date', limit: 6 });
  const featured = data?.data ?? [];
  const { data: ratedData } = useEvents({ when: 'upcoming', sort: '-rating', limit: 6 });
  const topRated = (ratedData?.data ?? []).filter((e) => e.ratingCount > 0).slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="col-rules absolute inset-0 opacity-60" aria-hidden />
        <Container className="relative grid items-center gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-3">
              Linemate · Cultural events · India
            </p>
            <h1 className="font-wonk mt-5 font-display text-display-xl font-medium text-ink">
              Go out <span className="italic text-accent">more.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-2">
              A box-office for the curious — gigs, talks, long dinners and late nights, with a seat saved in two taps.
            </p>
            <div className="mt-8 flex items-center gap-5">
              <Link to="/events">
                <Button size="md">Browse events</Button>
              </Link>
              <span className="h-6 w-px bg-line" aria-hidden />
              <a href="#how" className="link-underline text-[14px] text-ink-2">
                How it works
              </a>
            </div>
          </div>

          {/* Decorative signature ticket */}
          <div className="hidden justify-center md:flex" aria-hidden>
            <div className="w-full max-w-sm rotate-3">
              <TicketStub
                accentStyle={accentVars('decorative-hero')}
                eyebrow="Fri · 21 Jun · 20:00"
                title="Late Night Jazz: The Blue Hour"
                meta="BFlat Bar, Indiranagar · Bengaluru"
                seats={2}
                code="LM-7Q4K9P"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Running order */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-4">
            <h2 className="font-display text-h2 font-medium text-ink">
              <span className="font-mono text-[13px] tracking-[0.1em] text-ink-3">01 — </span>Now on sale
            </h2>
            <Link to="/events" className="link-underline inline-flex items-center gap-1.5 text-[14px] text-ink-2">
              All events <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
          {isLoading ? (
            <RunningOrderSkeleton rows={5} />
          ) : (
            <ol>
              {featured.map((event, i) => (
                <RunningOrderRow key={event.id} event={event} index={i} />
              ))}
            </ol>
          )}
        </Container>
      </section>

      {/* Highly rated */}
      {topRated.length > 0 ? (
        <section className="border-t border-line py-16 md:py-20">
          <Container>
            <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-4">
              <h2 className="font-display text-h2 font-medium text-ink">
                <span className="font-mono text-[13px] tracking-[0.1em] text-ink-3">02 — </span>Highly rated
              </h2>
              <Link
                to="/events?sort=-rating"
                className="link-underline inline-flex items-center gap-1.5 text-[14px] text-ink-2"
              >
                See all <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
            <ol>
              {topRated.map((event, i) => (
                <RunningOrderRow key={event.id} event={event} index={i} />
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {/* How it works */}
      <section id="how" className="border-y border-line bg-paper-3/60 py-16 md:py-20">
        <Container>
          <h2 className="font-display text-h2 font-medium text-ink">
            <span className="font-mono text-[13px] tracking-[0.1em] text-ink-3">03 — </span>How it works
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
            {STEPS.map(([num, title, body]) => (
              <div key={num} className="bg-paper-2 p-7">
                <p className="font-mono text-[13px] tabular-nums text-accent">{num}</p>
                <h3 className="mt-3 font-display text-[1.4rem] font-medium leading-tight text-ink">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Category index */}
      <section className="py-16 md:py-20">
        <Container>
          <h2 className="font-display text-h2 font-medium text-ink">
            <span className="font-mono text-[13px] tracking-[0.1em] text-ink-3">04 — </span>By category
          </h2>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-3">
            {EVENT_CATEGORIES.map((c) => (
              <Link
                key={c}
                to={`/events?category=${encodeURIComponent(c)}`}
                className="link-underline font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium text-ink/90 transition-colors hover:text-ink"
              >
                {c}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

const STATS = [
  ['Curated events', 'Hand-picked'],
  ['Cities', 'Across India'],
  ['To book', 'Two taps'],
  ['Cancellation', 'Always free'],
] as const;

const VALUES = [
  ['Curated, not endless', 'No infinite scroll. Every event on Linemate is worth leaving the house for — chosen, not dumped into a feed.'],
  ['Fair by design', 'Seats can never oversell. When something’s gone, it’s gone — no double-bookings, no nasty surprises at the door.'],
  ['Yours to keep', 'Every booking becomes a ticket with its own code, saved in one place. Cancel any time and the seat goes straight back.'],
] as const;

export function AboutPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container className="py-16 md:py-24">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-3">About Linemate</p>
          <h1 className="font-wonk mt-5 max-w-[18ch] font-display text-display font-medium text-ink">
            A box-office for the <span className="italic text-accent">curious.</span>
          </h1>
          <p className="mt-6 max-w-prose text-body-lg text-ink-2">
            Linemate is where a city’s best nights live — gigs, talks, long dinners and late films. We strip booking
            down to the essentials: find something worth your evening, reserve a seat in two taps, and keep your ticket
            in one place.
          </p>
        </Container>
      </section>

      <section className="border-b border-line bg-paper-3/60">
        <Container>
          <div className="grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
            {STATS.map(([label, value]) => (
              <div key={label} className="px-2 py-10 text-center">
                <p className="font-display text-[2rem] font-medium text-ink">{value}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16 md:py-20">
          <h2 className="font-display text-h2 font-medium text-ink">What we believe</h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
            {VALUES.map(([title, body]) => (
              <div key={title} className="bg-paper-2 p-7">
                <h3 className="font-display text-[1.4rem] font-medium leading-tight text-ink">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-ink-bg text-paper-on-ink">
        <Container className="py-16 text-center md:py-20">
          <h2 className="font-display text-display font-medium">
            Go out <span className="italic text-accent">more.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[42ch] text-paper-on-ink/70">
            There’s something on tonight. Find your seat.
          </p>
          <div className="mt-8">
            <Link to="/events">
              <Button>Browse events</Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

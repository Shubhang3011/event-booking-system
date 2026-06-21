import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const FAQS = [
  ['How do I book a seat?', 'Open any event, pick how many seats you want, and hit “Reserve”. You’ll need an account — registering takes about ten seconds.'],
  ['Is it free?', 'Yes. Bookings on Linemate are free seat reservations — there’s no payment step. Just reserve and show up.'],
  ['Can I cancel a booking?', 'Any time, for free. Go to My Tickets, open the booking and choose Cancel. Your seats go straight back to the event.'],
  ['How many seats can I book?', 'Up to 10 seats per booking. Need more? Make a second booking — there’s no limit on how many bookings you make.'],
  ['What happens when an event sells out?', 'It’s marked “Sold out” and booking closes. Because seats are reserved atomically, an event can never oversell.'],
  ['Where are my tickets?', 'Under My Tickets in your account menu — each one has its own booking code and barcode you can show at the door.'],
  ['Do you have a dark mode?', 'Yes. Use the sun/moon button in the top bar, or go to Settings → Appearance to pick Light, Dark, or System.'],
] as const;

export function FaqPage() {
  useDocumentTitle('FAQ');
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-3">Help</p>
        <h1 className="mt-3 font-display text-h1 font-medium text-ink">Frequently asked questions</h1>

        <div className="mt-8 border-y border-line">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group border-b border-line py-4 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[1.25rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <Plus
                  className="h-5 w-5 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-45"
                  strokeWidth={1.75}
                />
              </summary>
              <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-2">{a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-[15px] text-ink-2">
          Still stuck?{' '}
          <Link to="/contact" className="link-underline text-ink">
            Get in touch
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}

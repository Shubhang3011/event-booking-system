import { Container } from '@/components/layout/Container';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SECTIONS = [
  ['1. About these terms', 'Linemate is a demo event-booking application. By creating an account or booking a seat you agree to these terms. This product is provided for demonstration purposes.'],
  ['2. Your account', 'You are responsible for keeping your password secure and for activity on your account. Provide accurate details when you register.'],
  ['3. Bookings', 'Bookings are free seat reservations. Seats are limited and allocated on a first-come basis. You may cancel a booking at any time, which returns the seats to the event.'],
  ['4. Acceptable use', 'Do not misuse the service, attempt to disrupt it, or book seats you do not intend to use in order to deny them to others.'],
  ['5. Availability', 'We aim to keep the service available but do not guarantee uninterrupted access. Events and their details may change or be removed.'],
  ['6. Liability', 'The service is provided “as is”, without warranties. To the extent permitted by law, Linemate is not liable for any loss arising from use of the service.'],
  ['7. Changes', 'We may update these terms from time to time. Continued use of the service means you accept the latest version.'],
] as const;

export function TermsPage() {
  useDocumentTitle('Terms of Service');
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-3">Legal</p>
        <h1 className="mt-3 font-display text-h1 font-medium text-ink">Terms of Service</h1>
        <p className="mt-2 text-[13px] text-ink-3">Last updated: June 2026</p>
        <div className="mt-8 space-y-8">
          {SECTIONS.map(([title, body]) => (
            <section key={title}>
              <h2 className="font-display text-[1.3rem] font-medium text-ink">{title}</h2>
              <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink-2">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}

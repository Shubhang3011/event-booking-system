import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { supportApi, toApiError } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

function FooterCol({ title, links }: { title: string; links: [label: string, to: string][] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-[14px] text-ink-2 transition-colors hover:text-ink">
              <span className="link-underline">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterForm() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      await supportApi.subscribe(email);
      toast.success("You're subscribed.");
      setEmail('');
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address for newsletter"
        className="h-11 flex-1 rounded-sm border border-line bg-paper-2 px-3.5 text-[14px] text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
      />
      <Button type="submit" isLoading={busy}>
        Subscribe
      </Button>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-3">
      <div className="mx-auto max-w-content px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-6 border-b border-line py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-h2 font-medium text-ink">Never miss a night out.</h2>
            <p className="mt-2 max-w-[40ch] text-[14px] text-ink-2">
              The best new events in your city, about once a week. No spam.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-sm bg-ink">
                <span className="h-3 w-3 rounded-full bg-accent" />
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-ink">Linemate</span>
            </div>
            <p className="mt-3 max-w-[34ch] font-display text-[1.1rem] italic text-ink-2">
              An editorial box-office. Go out more.
            </p>
          </div>
          <FooterCol title="Discover" links={[['All events', '/events'], ['Saved', '/saved']]} />
          <FooterCol title="Account" links={[['My tickets', '/bookings'], ['Settings', '/settings'], ['Sign in', '/login']]} />
          <FooterCol title="Company" links={[['About', '/about'], ['FAQ', '/faq'], ['Contact', '/contact']]} />
        </div>

        <div className="flex flex-col gap-3 border-t border-dashed border-line-strong py-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            © 2026 Linemate · Made for the curious
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">React · Express · MongoDB</p>
        </div>
      </div>
    </footer>
  );
}

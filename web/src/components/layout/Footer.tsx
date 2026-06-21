import { Link } from 'react-router-dom';

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

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-3">
      <div className="mx-auto max-w-content px-6 md:px-10 lg:px-16">
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
          <FooterCol title="Discover" links={[['All events', '/events'], ['Tonight', '/events?when=upcoming']]} />
          <FooterCol
            title="Account"
            links={[['My tickets', '/bookings'], ['Sign in', '/login'], ['Register', '/register']]}
          />
          <FooterCol title="About" links={[['Made for the curious', '/']]} />
        </div>
        <div className="flex flex-col gap-3 border-t border-dashed border-line-strong py-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            © 2026 Linemate · Made for the curious
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            React · Express · MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}

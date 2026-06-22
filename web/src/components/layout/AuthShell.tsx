import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';
import { cn } from '@/lib/cn';

export function AuthSwitch({ active }: { active: 'login' | 'register' }) {
  const tab = (to: string, label: string, isActive: boolean) => (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative pb-2 text-[12px] transition-colors',
        isActive ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
      )}
    >
      {label}
      {isActive ? <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" /> : null}
    </Link>
  );
  return (
    <div className="flex gap-6 border-b border-line">
      {tab('/login', 'Sign in', active === 'login')}
      {tab('/register', 'Register', active === 'register')}
    </div>
  );
}

interface AuthShellProps {
  heading: string;
  kicker: string;
  manifesto: string;
  children: ReactNode;
}

/** Split-screen auth: dark editorial panel on the left, the form on paper. */
export function AuthShell({ heading, kicker, manifesto, children }: AuthShellProps) {
  return (
    <Container className="py-10 md:py-16">
      <div className="grid overflow-hidden rounded-lg border border-line bg-paper-2 md:grid-cols-[5fr_7fr]">
        <div className="relative hidden flex-col justify-between border-r border-dashed border-ink-line bg-ink-bg p-10 text-paper-on-ink md:flex">
          <p className="text-[11px] text-paper-on-ink/55">
            Linemate · Box office
          </p>
          <div>
            <h1 className="text-display font-bold leading-[1.02]">
              {heading} <span className="text-accent">{kicker}</span>
            </h1>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-paper-on-ink/70">{manifesto}</p>
          </div>
          <p className="text-[11px] text-paper-on-ink/45">
            Instant confirmation · Free cancellation
          </p>
        </div>
        <div className="p-8 md:p-12">{children}</div>
      </div>
    </Container>
  );
}

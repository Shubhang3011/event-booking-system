import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Stamp } from '@/components/ui/Stamp';

interface TicketStubProps {
  eyebrow: string;
  title: string;
  meta: string;
  seats: number;
  code: string;
  /** Overlaid rubber stamp when the ticket is no longer active. */
  stamp?: { label: string; tone: 'ink' | 'danger'; animate?: boolean };
  variant?: 'light' | 'dark';
  accentStyle?: CSSProperties;
  /** Colour of the punched notches — should match the page behind the ticket. */
  pageBg?: string;
  footer?: ReactNode;
  className?: string;
}

/**
 * The perforated ticket — RECTO's signature object. Two panels split by a
 * dashed seam with punched semicircle notches, a rotated mono booking ref, and
 * a CSS-only barcode. Rendered, never an image.
 */
export function TicketStub({
  eyebrow,
  title,
  meta,
  seats,
  code,
  stamp,
  variant = 'light',
  accentStyle,
  pageBg,
  footer,
  className,
}: TicketStubProps) {
  const dark = variant === 'dark';
  // Notches are filled with the page colour to read as punched holes; using the
  // theme variables keeps them correct in both light and dark mode.
  const notch = pageBg ?? (dark ? 'rgb(var(--c-ink-bg))' : 'rgb(var(--c-paper))');

  return (
    <div
      style={accentStyle}
      className={cn(
        'relative flex items-stretch overflow-hidden rounded-md border shadow-paper-1',
        dark ? 'border-ink-line bg-ink-bg-2 text-paper-on-ink' : 'border-line bg-paper-2 text-ink',
        className,
      )}
    >
      {/* Left: details */}
      <div className="relative min-w-0 flex-1 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--ev-accent)]">{eyebrow}</p>
        <h3 className={cn('mt-1 font-display text-[1.4rem] font-medium leading-tight line-clamp-2')}>{title}</h3>
        <p className={cn('mt-1 truncate text-[13px]', dark ? 'text-paper-on-ink/60' : 'text-ink-3')}>{meta}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className={cn('font-mono text-[11px] uppercase tracking-[0.1em]', dark ? 'text-paper-on-ink/55' : 'text-ink-3')}>
            Seats
          </span>
          <span className="font-mono text-base tabular-nums">{String(seats).padStart(2, '0')}</span>
        </div>
        {footer ? <div className="mt-4">{footer}</div> : null}

        {stamp ? (
          <span className="pointer-events-none absolute right-4 top-4">
            <Stamp tone={stamp.tone} animate={stamp.animate}>
              {stamp.label}
            </Stamp>
          </span>
        ) : null}
      </div>

      {/* Perforation seam with punched notches */}
      <div className={cn('relative w-0 self-stretch border-l border-dashed', dark ? 'border-ink-line' : 'border-line-strong')}>
        <span className="absolute -top-[7px] -left-[7px] h-3.5 w-3.5 rounded-full" style={{ background: notch }} aria-hidden />
        <span className="absolute -bottom-[7px] -left-[7px] h-3.5 w-3.5 rounded-full" style={{ background: notch }} aria-hidden />
      </div>

      {/* Right: stub */}
      <div className="flex w-[6.25rem] shrink-0 flex-col items-center justify-between gap-3 p-3">
        <span className={cn('font-mono text-[10px] uppercase tracking-[0.16em]', dark ? 'text-paper-on-ink/55' : 'text-ink-3')}>
          Admit
        </span>
        <span
          className="font-mono text-[12px] uppercase tracking-[0.18em] tabular-nums"
          style={{ writingMode: 'vertical-rl' }}
          aria-hidden
        >
          {code}
        </span>
        <span className={cn('barcode w-full', dark ? 'text-paper-on-ink/80' : 'text-ink/85')} aria-hidden />
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'success' | 'warn' | 'danger' | 'neutral' | 'accent';

const tones: Record<BadgeTone, string> = {
  success: 'bg-success-wash text-success',
  warn: 'bg-warn-wash text-warn',
  danger: 'bg-danger-wash text-danger',
  neutral: 'bg-paper-3 text-ink-3',
  accent: 'bg-accent-wash text-accent-press',
};

interface BadgeProps {
  tone?: BadgeTone;
  withDot?: boolean;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}

/** Status pill — always a mono word, never colour alone. */
export function Badge({ tone = 'neutral', withDot = false, pulse = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em]',
        tones[tone],
        className,
      )}
    >
      {withDot ? (
        <span className="relative flex h-[5px] w-[5px]">
          {pulse ? (
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-current" />
          ) : null}
          <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-current" />
        </span>
      ) : null}
      {children}
    </span>
  );
}

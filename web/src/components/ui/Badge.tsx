import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'success' | 'warn' | 'danger' | 'neutral' | 'accent';

const tones: Record<BadgeTone, string> = {
  success: 'bg-success-wash text-success',
  warn: 'bg-warn-wash text-warn',
  danger: 'bg-danger-wash text-danger',
  neutral: 'bg-paper-3 text-ink-2',
  accent: 'bg-accent-wash text-accent-press',
};

interface BadgeProps {
  tone?: BadgeTone;
  withDot?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = 'neutral', withDot = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {withDot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

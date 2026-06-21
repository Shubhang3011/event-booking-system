import { cn } from '@/lib/cn';

interface StampProps {
  children: string;
  tone?: 'ink' | 'danger' | 'paper';
  className?: string;
  animate?: boolean;
}

/** Rotated rubber-stamp overlay — SOLD OUT / VOID / CANCELLED / PAST. */
export function Stamp({ children, tone = 'ink', className, animate = false }: StampProps) {
  return (
    <span
      className={cn(
        'stamp',
        tone === 'ink' && 'text-ink/80',
        tone === 'danger' && 'text-danger',
        tone === 'paper' && 'text-paper-on-ink',
        animate && 'animate-stamp-in',
        className,
      )}
    >
      {children}
    </span>
  );
}

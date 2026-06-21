import { cn } from '@/lib/cn';
import { dateRail } from '@/lib/format';

interface DateRailProps {
  date: string;
  /** Render the day number in the event accent (used for "tonight"). */
  accent?: boolean;
  className?: string;
}

/** The print-style date block: big Fraunces day over mono month / weekday. */
export function DateRail({ date, accent = false, className }: DateRailProps) {
  const { day, month, weekday } = dateRail(date);
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <span
        className={cn(
          'font-display text-[2.75rem] font-medium leading-[0.9]',
          accent ? 'text-[color:var(--ev-accent)]' : 'text-ink',
        )}
      >
        {day}
      </span>
      <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">{month}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{weekday}</span>
    </div>
  );
}

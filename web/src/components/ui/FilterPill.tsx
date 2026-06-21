import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface FilterPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function FilterPill({ active = false, className, children, ...props }: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.06em] transition-colors duration-150',
        active
          ? 'border-ink bg-ink text-paper-2'
          : 'border-line bg-paper-2 text-ink-2 hover:border-line-strong hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

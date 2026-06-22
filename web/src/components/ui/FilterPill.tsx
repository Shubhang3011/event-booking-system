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
        'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150',
        active
          ? 'border-accent bg-accent text-white'
          : 'border-line bg-paper-2 text-ink-2 hover:border-line-strong hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'event';
export type ButtonSize = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-sans font-semibold transition-all duration-150 ease-editorial select-none disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none';

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[15px]',
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-paper-2 hover:bg-accent-press hover:-translate-y-px active:translate-y-0',
  secondary: 'border-[1.5px] border-ink bg-paper-2 text-ink hover:bg-ink hover:text-paper-2',
  ghost: 'text-ink-2 hover:bg-ink/[0.06] hover:text-ink',
  danger: 'border border-danger text-danger hover:bg-danger-wash',
  // Uses the per-event accent via CSS variables set on an ancestor.
  event:
    'bg-[color:var(--ev-accent)] text-[color:var(--ev-accent-ink)] hover:-translate-y-px hover:brightness-[0.96] active:translate-y-0',
};

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(base, sizes[size], variants[variant], fullWidth && 'w-full', className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, isLoading, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, fullWidth, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent opacity-80"
        />
      ) : null}
      {children}
    </button>
  );
});

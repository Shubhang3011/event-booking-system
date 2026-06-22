import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  htmlFor?: string;
  label: string;
  error?: string;
  hint?: string;
  counter?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ htmlFor, label, error, hint, counter, className, children }: FieldProps) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink-2">
          {label}
        </label>
        {counter ? <span className="text-[12px] tabular-nums text-ink-3">{counter}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={describedBy} className="text-[12px] text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={describedBy} className="text-[12px] text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

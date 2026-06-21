import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  /** The input's id, tied to the <label>. */
  htmlFor?: string;
  label: string;
  error?: string;
  hint?: string;
  /** Right-aligned mono counter, e.g. "12 / 80". */
  counter?: string;
  className?: string;
  children: ReactNode;
}

/** Overline (mono, uppercase) label sitting above the control, with error/hint. */
export function Field({ htmlFor, label, error, hint, counter, className, children }: FieldProps) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2"
        >
          {label}
        </label>
        {counter ? <span className="font-mono text-[11px] tabular-nums text-ink-3">{counter}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={describedBy} className="font-mono text-[12px] text-danger" role="alert">
          <span aria-hidden>! </span>
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

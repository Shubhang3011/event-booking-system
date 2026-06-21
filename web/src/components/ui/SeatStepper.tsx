import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { padCount } from '@/lib/format';

interface SeatStepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max: number;
  disabled?: boolean;
}

const stepBtn =
  'grid w-11 place-items-center text-ink transition-colors hover:bg-ink hover:text-paper-2 ' +
  'disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink';

/** Bordered mono [ − ] 02 [ + ] control with a seat-glyph row. */
export function SeatStepper({ value, onChange, min = 1, max, disabled = false }: SeatStepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;
  const glyphs = Math.min(max, 10);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="inline-flex h-11 w-fit items-stretch overflow-hidden rounded-sm border border-line bg-paper-2"
        role="group"
        aria-label="Number of seats"
      >
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={disabled || atMin} aria-label="Remove a seat" className={cn(stepBtn, 'border-r border-line')}>
          <Minus className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <output className="grid min-w-[3.5rem] place-items-center px-3 font-mono text-lg tabular-nums text-ink" aria-live="polite">
          {padCount(value, 2)}
        </output>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={disabled || atMax} aria-label="Add a seat" className={cn(stepBtn, 'border-l border-line')}>
          <Plus className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1" aria-hidden>
        {Array.from({ length: glyphs }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-2.5 w-2.5 rounded-[2px] border transition-colors',
              i < value ? 'border-transparent bg-[color:var(--ev-accent)]' : 'border-line bg-paper-3',
            )}
          />
        ))}
        {max > 10 ? <span className="ml-1 font-mono text-[11px] text-ink-3">+{max - 10}</span> : null}
      </div>

      {atMax ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Max {max} available</p>
      ) : null}
    </div>
  );
}

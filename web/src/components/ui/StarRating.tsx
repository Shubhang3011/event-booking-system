import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
}

/** Read-only when no onChange is passed; an accessible radiogroup when it is. */
export function StarRating({ value, onChange, size = 18, className }: StarRatingProps) {
  const interactive = Boolean(onChange);

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Your rating' : `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={cn(filled ? 'fill-accent text-accent' : 'fill-transparent text-line-strong')}
            strokeWidth={1.5}
          />
        );
        if (!interactive) return <span key={n}>{star}</span>;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onChange?.(n)}
            className="cursor-pointer p-0.5 transition-transform hover:scale-110"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}

import { cn } from '@/lib/cn';

/** Geometry-matched pulse block — no shimmer-gradient slop. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-skeleton rounded-sm bg-paper-3', className)} aria-hidden />;
}

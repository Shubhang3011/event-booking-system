import { Skeleton } from '@/components/ui/Skeleton';

/** Grid-card skeleton that keeps the real geometry (date rail + text + badge). */
export function EventCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-md border border-line bg-paper-2 p-5">
      <div className="flex w-12 shrink-0 flex-col items-center gap-2 border-r border-line pr-4">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-2 w-7" />
      </div>
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-2.5 w-32" />
        <Skeleton className="h-5 w-[85%]" />
        <Skeleton className="h-3 w-40" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Running-order skeleton with the mono indices already typeset. */
export function RunningOrderSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ol>
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-line py-5">
          <span className="font-mono text-[13px] tabular-nums text-ink-3/50">{String(i + 1).padStart(2, '0')}</span>
          <Skeleton className="h-6 w-[60%]" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </li>
      ))}
    </ol>
  );
}

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { coverImage } from '@/lib/coverImage';
import { eventAccent } from '@/lib/eventAccent';
import type { EventItem } from '@/lib/types';

/** Event cover photo that fills its (positioned) parent, with a graceful
 *  per-event gradient fallback if the image fails to load. */
export function EventImage({ event, className }: { event: EventItem; className?: string }) {
  const [failed, setFailed] = useState(false);
  const { accent } = eventAccent(event.id);

  if (failed) {
    return (
      <div
        className="grid h-full w-full place-items-center bg-paper-3"
        style={{ backgroundImage: `linear-gradient(135deg, ${accent}33, transparent 70%)` }}
        aria-hidden
      >
        <span className="text-[11px] text-ink-3">{event.category}</span>
      </div>
    );
  }

  return (
    <img
      src={coverImage(event)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}

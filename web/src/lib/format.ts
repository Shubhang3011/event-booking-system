import { format, formatDistanceToNowStrict, isPast } from 'date-fns';

const d = (value: string | Date): Date => (value instanceof Date ? value : new Date(value));

/** "FRI · 21 JUN · 20:00" — the masthead dateline. */
export function dateline(value: string | Date): string {
  return format(d(value), 'EEE · dd MMM · HH:mm').toUpperCase();
}

/** Components of the date-rail block. */
export function dateRail(value: string | Date): { day: string; month: string; weekday: string } {
  const date = d(value);
  return {
    day: format(date, 'dd'),
    month: format(date, 'MMM').toUpperCase(),
    weekday: format(date, 'EEE').toUpperCase(),
  };
}

/** "Friday, 21 June 2026" */
export function longDate(value: string | Date): string {
  return format(d(value), 'EEEE, d MMMM yyyy');
}

/** "20:00" */
export function time(value: string | Date): string {
  return format(d(value), 'HH:mm');
}

/** "in 3 days" / "2 months ago" */
export function relativeTime(value: string | Date): string {
  const date = d(value);
  return `${isPast(date) ? '' : 'in '}${formatDistanceToNowStrict(date)}${isPast(date) ? ' ago' : ''}`;
}

export function seatsLabel(n: number): string {
  return `${n} seat${n === 1 ? '' : 's'}`;
}

/** Departure-board padding: 42 -> "042". */
export function padCount(n: number, width = 3): string {
  return String(Math.max(0, n)).padStart(width, '0');
}

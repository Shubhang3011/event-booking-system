import type { EventItem } from './types';

/** Share an event via the native share sheet, falling back to copying the link. */
export async function shareEvent(event: Pick<EventItem, 'id' | 'title'>): Promise<'shared' | 'copied' | 'failed'> {
  const url = `${window.location.origin}/events/${event.id}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: event.title, text: `Check out ${event.title} on Linemate`, url });
      return 'shared';
    } catch {
      // user cancelled or share failed — fall through to copy
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}

function icsStamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
}

function icsEscape(s: string): string {
  return s.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
}

/** Build an .ics calendar file for an event (assumes a 2-hour duration). */
export function eventToIcs(event: EventItem): string {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Linemate//Event//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@linemate`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DESCRIPTION:${icsEscape(event.description)}`,
    `LOCATION:${icsEscape(`${event.venue}, ${event.city}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(event: EventItem): void {
  const blob = new Blob([eventToIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^\w.-]+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * "The door" — each event gets ONE accent from a tight, curated set, hashed
 * deterministically from its id. House vermilion stays the global brand colour;
 * per-event accents turn the index into a warm mosaic instead of purple-by-default.
 */
const PALETTE = [
  '#E5432F', // vermilion (house)
  '#C24B63', // rose
  '#6E7A38', // olive
  '#2F4FBF', // cobalt
  '#6A3A66', // plum
  '#1F7A72', // teal
  '#B5742A', // ochre
] as const;

import type { CSSProperties } from 'react';

export interface EventAccent {
  accent: string;
  /** Readable text colour to place on top of `accent`. */
  onAccent: string;
}

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** WCAG relative luminance, used to pick black vs paper text on the accent. */
function luminance(hex: string): number {
  const v = hex.replace('#', '');
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = channel(parseInt(v.slice(0, 2), 16));
  const g = channel(parseInt(v.slice(2, 4), 16));
  const b = channel(parseInt(v.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function eventAccent(id: string): EventAccent {
  const accent = PALETTE[hash(id) % PALETTE.length]!;
  const onAccent = luminance(accent) > 0.5 ? '#1A1714' : '#FBF9F3';
  return { accent, onAccent };
}

/** CSS custom properties to scope an event's accent onto a subtree. */
export function accentVars(source: string | EventAccent): CSSProperties {
  const a = typeof source === 'string' ? eventAccent(source) : source;
  return { ['--ev-accent']: a.accent, ['--ev-accent-ink']: a.onAccent } as CSSProperties;
}

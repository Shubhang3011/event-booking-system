# Design notes — "Linemate, an editorial box-office"

The brief asked for a booking product that looks **crafted by a product designer, not
generated**. The whole UI follows one idea: *a cultural-events broadsheet you can book a
seat from.* Warm paper, confident ink, a single vermilion spot colour, type set like a
masthead, and a real **perforated ticket** as the recurring brand object.

## What keeps it from looking templated

| Trap (the "AI slop" defaults) | What Linemate does instead |
| --- | --- |
| Inter everywhere | **Fraunces** (display serif) + **Hanken Grotesk** (UI) + **Spline Sans Mono** (all ticketing data) |
| Purple gradient hero | One disciplined **vermilion `#E5432F`**, plus a tight set of per-event accents |
| `#FFFFFF` / `#000000` | Warm **paper `#F7F4EC`** and warm **ink `#1A1714`** |
| A grid of identical cards | The **Running Order** — a numbered, hairline-ruled lineup (`<ol>` of `<a>` rows) |
| Drop-shadow soup / glassmorphism | Elevation is **paper-on-paper via 1px hairlines** and at most one soft warm shadow |
| Rounded-everything | Near-flat radii (0–12px); `rounded-full` only for pills and avatars |
| Emoji icons | Hairline Lucide strokes + typographic marks (perforation dots, `→`, `01/02` numerals) |
| Stock-photo covers | **Generative, per-event** duotone "posters" built from the event's own data (CSS/SVG) |
| Sad-shrug empty states | On-theme frames — a phantom ticket, *"Your stub drawer is empty."* |
| Colour-only status | Always a **mono word + dot / stamp / shape** (colourblind-safe) |

## Signature details

- **The ticket stub** — bookings, the confirmation and My Tickets render as a real ticket:
  two panels split by a dashed perforation with punched semicircle notches, a rotated mono
  booking ref and a CSS-only barcode. Rendered, never an image.
- **Per-event colour identity** — each event is hashed from its id to one accent from a
  curated set (vermilion, rose, olive, cobalt, plum, teal, ochre). Browsing becomes a warm
  mosaic; house vermilion stays the brand chrome.
- **Departure-board seat counter** — remaining seats tick on a dark inline panel
  (`042 / left of 140`), airport-board language that reads as ticketing, not generic SaaS.
- **One dark beat** — the booking confirmation flips to ink-black so the perforated ticket,
  vermilion `CONFIRMED` stamp and barcode feel like a physical pass.
- **Rubber-stamp status** — sold-out / past / cancelled get a rotated, letter-spaced outline
  stamp (`SOLD OUT`, `VOID`) instead of a greyed-out card.

## Tokens

- **Type scale** — fluid `clamp()` display sizes; Fraunces only for headlines/numerals and
  exactly one italic kicker per page; every meaningful number is mono with `tabular-nums`.
- **Colour** — see [`web/tailwind.config.ts`](../web/tailwind.config.ts) for the full palette
  (paper/ink/line/accent + status + the dark beat).
- **Motion** — "paper settling", never bounce: a single easing
  `cubic-bezier(0.2,0.6,0.2,1)`, 120/200/320ms. A full `prefers-reduced-motion` path drops
  every transform, the digit rolls, the confetti and the stamp slam.

## Accessibility

- Contrast: ink-on-paper ≈ 13:1, secondary ink ≈ 7:1 (AA body), accent ≈ 4.6:1 (AA UI).
- Visible 2px accent focus ring on every interactive element; inputs use an inset ring to
  avoid layout shift.
- Real semantics: the running order is an `<ol>` of links, the seat stepper announces its
  total via `aria-live`, modals trap focus and restore it on close and close on `Esc`,
  toasts use `role="status"`/`role="alert"`, the barcode is `aria-hidden` with the
  human-readable booking ref exposed, every field has a persistent `<label>`.
- 44px minimum hit targets; layout survives 200% zoom via fluid clamps.

The direction was chosen by a small panel of design proposals (editorial / dark-tech /
playful / swiss) judged against the brief; the editorial direction won for being the most
premium and least "AI dark dashboard", with the strongest ideas from the others grafted in
(the numbered running order, per-event colour, generative covers).

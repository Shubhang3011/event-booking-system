import type { Config } from 'tailwindcss';

/**
 * RECTO — "an editorial box-office".
 * Warm paper, confident ink, one vermilion spot colour, a small set of
 * per-event accents, hairline borders, near-flat radii, paper-not-glass shadow.
 */
// Colours are driven by CSS variables (see index.css) so the whole palette can
// flip between light and dark themes from one place. The `<alpha-value>` form
// keeps Tailwind opacity utilities (bg-ink/40 etc.) working.
const c = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: c('paper'),
        'paper-2': c('paper-2'),
        'paper-3': c('paper-3'),
        ink: c('ink'),
        'ink-2': c('ink-2'),
        'ink-3': c('ink-3'),
        line: c('line'),
        'line-strong': c('line-strong'),
        accent: c('accent'),
        'accent-press': c('accent-press'),
        'accent-wash': c('accent-wash'),
        // Curated per-event identity colours
        'ev-rose': c('ev-rose'),
        'ev-olive': c('ev-olive'),
        'ev-cobalt': c('ev-cobalt'),
        'ev-plum': c('ev-plum'),
        'ev-teal': c('ev-teal'),
        'ev-ochre': c('ev-ochre'),
        // Status
        success: c('success'),
        'success-wash': c('success-wash'),
        warn: c('warn'),
        'warn-wash': c('warn-wash'),
        danger: c('danger'),
        'danger-wash': c('danger-wash'),
        // The dark "beat" surfaces (login panel, confirmation, toast, board)
        'ink-bg': c('ink-bg'),
        'ink-bg-2': c('ink-bg-2'),
        'ink-line': c('ink-line'),
        'paper-on-ink': c('paper-on-ink'),
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        display: ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.0', letterSpacing: '-0.015em' }],
        h1: ['2.5rem', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        h2: ['1.75rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h3: ['1.125rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        body: ['0.9375rem', { lineHeight: '1.55' }],
        caption: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        overline: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
        'mono-data': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },
      boxShadow: {
        'paper-1': '0 1px 0 rgba(0,0,0,0.03), 0 1px 2px rgba(26,23,20,0.05)',
        'paper-2': '0 8px 24px -12px rgba(26,23,20,0.22)',
      },
      maxWidth: {
        prose: '68ch',
        content: '1200px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.2, 0.6, 0.2, 1)',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        'stamp-in': {
          '0%': { transform: 'rotate(-5deg) scale(1.6)', opacity: '0' },
          '60%': { transform: 'rotate(-5deg) scale(0.92)', opacity: '1' },
          '100%': { transform: 'rotate(-5deg) scale(1)', opacity: '1' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'confetti-drift': {
          '0%': { transform: 'translateY(-8px) rotate(0deg)', opacity: '0' },
          '15%': { opacity: '1' },
          '100%': { transform: 'translateY(120px) rotate(220deg)', opacity: '0' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.4s cubic-bezier(0.2, 0.6, 0.2, 1) both',
        'pulse-ring': 'pulse-ring 1.9s ease-out infinite',
        skeleton: 'skeleton-pulse 1.4s ease-in-out infinite',
        'stamp-in': 'stamp-in 0.42s cubic-bezier(0.2, 0.6, 0.2, 1) both',
        'toast-in': 'toast-in 0.2s cubic-bezier(0.2, 0.6, 0.2, 1) both',
        confetti: 'confetti-drift 1.5s ease-in forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;

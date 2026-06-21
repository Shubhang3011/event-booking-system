import type { Config } from 'tailwindcss';

/**
 * RECTO — "an editorial box-office".
 * Warm paper, confident ink, one vermilion spot colour, a small set of
 * per-event accents, hairline borders, near-flat radii, paper-not-glass shadow.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F4EC',
        'paper-2': '#FBF9F3',
        'paper-3': '#EFEBDF',
        ink: '#1A1714',
        'ink-2': '#534E45',
        'ink-3': '#8A8475',
        line: '#E2DCCD',
        'line-strong': '#CFC8B5',
        accent: '#E5432F',
        'accent-press': '#C5331F',
        'accent-wash': '#FBE3DD',
        // Curated per-event identity colours
        'ev-rose': '#C24B63',
        'ev-olive': '#6E7A38',
        'ev-cobalt': '#2F4FBF',
        'ev-plum': '#6A3A66',
        'ev-teal': '#1F7A72',
        'ev-ochre': '#B5742A',
        // Status
        success: '#2E6E4E',
        'success-wash': '#E2EDE5',
        warn: '#A8741A',
        'warn-wash': '#F2E9D5',
        danger: '#B23A2B',
        'danger-wash': '#F7E2E0',
        // The single dark beat
        'ink-bg': '#16130F',
        'ink-bg-2': '#221E18',
        'ink-line': '#2C2A24',
        'paper-on-ink': '#EDE7D8',
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

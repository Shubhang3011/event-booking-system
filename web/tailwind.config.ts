import type { Config } from 'tailwindcss';

// Colours are driven by CSS variables (see index.css) so the whole palette can
// flip between light and dark themes from one place.
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
        // Status
        success: c('success'),
        'success-wash': c('success-wash'),
        warn: c('warn'),
        'warn-wash': c('warn-wash'),
        danger: c('danger'),
        'danger-wash': c('danger-wash'),
        // Dark surfaces (login panel, toast, confirmation)
        'ink-bg': c('ink-bg'),
        'ink-bg-2': c('ink-bg-2'),
        'ink-line': c('ink-line'),
        'paper-on-ink': c('paper-on-ink'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        display: ['clamp(2.25rem, 4.5vw, 3.25rem)', { lineHeight: '1.07', letterSpacing: '-0.02em' }],
        h1: ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h2: ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        h3: ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6' }],
        body: ['0.9375rem', { lineHeight: '1.55' }],
        caption: ['0.8125rem', { lineHeight: '1.4' }],
        overline: ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        none: '0',
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        'paper-1': '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.04)',
        'paper-2': '0 4px 16px -4px rgba(16,24,40,0.12)',
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
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.35s cubic-bezier(0.2, 0.6, 0.2, 1) both',
        skeleton: 'skeleton-pulse 1.4s ease-in-out infinite',
        'toast-in': 'toast-in 0.2s cubic-bezier(0.2, 0.6, 0.2, 1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;

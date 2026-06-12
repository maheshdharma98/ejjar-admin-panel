/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Cairo', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      colors: {
        brand: {
          navy:    '#101828',
          orange:  '#E67E3A',
          skyblue: '#4DA8C7',
          tooltip: '#1A2740',
        },
        surface: {
          page:    '#F8FAFC',
          card:    '#FFFFFF',
          input:   '#F8FAFC',
          sidebar: '#101828',
        },
        border: {
          card:    '#E2E8F0',
          input:   '#E2E8F0',
          active:  '#E67E3A',
          divider: '#F1F5F9',
        },
        text: {
          primary:   '#0F172A',
          secondary: '#475569',
          muted:     '#64748B',
          ondark:    '#FFFFFF',
          label:     '#94A3B8',
        },
        status: {
          successBg:   '#DCFCE7',
          successText: '#166534',
          warningBg:   '#FEF9C3',
          warningText: '#854D0E',
          errorBg:     '#FEE2E2',
          errorText:   '#991B1B',
          infoBg:      '#E0F2FE',
          infoText:    '#0369A1',
          pendingBg:   '#F1F5F9',
          pendingText: '#475569',
        },
        semantic: {
          success: '#22C55E',
          warning: '#F59E0B',
          error:   '#EF4444',
          info:    '#4DA8C7',
        },
        // backward compat
        primary: '#101828',
        sidebar: '#101828',
      },
    },
  },
  safelist: [
    // Brand
    'bg-brand-navy', 'bg-brand-orange', 'bg-brand-skyblue', 'bg-brand-tooltip',
    'text-brand-navy', 'text-brand-orange', 'text-brand-skyblue',
    'border-brand-orange',
    // Surface
    'bg-surface-page', 'bg-surface-card', 'bg-surface-input', 'bg-surface-sidebar',
    // Border
    'border-border-card', 'border-border-input', 'border-border-active', 'border-border-divider',
    // Text
    'text-text-primary', 'text-text-secondary', 'text-text-muted', 'text-text-ondark', 'text-text-label',
    // Status bg
    'bg-status-successBg', 'bg-status-warningBg', 'bg-status-errorBg', 'bg-status-infoBg', 'bg-status-pendingBg',
    // Status text
    'text-status-successText', 'text-status-warningText', 'text-status-errorText', 'text-status-infoText', 'text-status-pendingText',
    // Semantic
    'bg-semantic-success', 'bg-semantic-warning', 'bg-semantic-error', 'bg-semantic-info',
    'text-semantic-success', 'text-semantic-warning', 'text-semantic-error',
  ],
  plugins: [],
}

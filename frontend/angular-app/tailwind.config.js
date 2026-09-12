/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
          light: '#3B82F6',
        },
        secondary: '#7C3AED',
        accent: '#0D9488',
        alerta: '#F59E0B',
        error: '#EF4444',
        surface: '#F5F7FB',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(15,23,42,0.04)',
        'card-hover': '0 10px 30px -10px rgba(15,23,42,0.12)',
        'card-kpi': '0 12px 28px -12px rgba(15,23,42,0.15)',
        'filter': '0 4px 16px -6px rgba(15,23,42,0.08)',
        'nav-active': '0 4px 12px -2px rgba(37,99,235,0.4)',
        'chip-active': '0 2px 6px -1px rgba(37,99,235,0.35)',
      },
    },
  },
  plugins: [],
};

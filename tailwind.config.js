/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12141C',
          soft: '#5B6172',
          faint: '#9096A8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F6F7FB',
          hover: '#EEF1F7',
          border: '#E5E8F0',
        },
        accent: {
          DEFAULT: '#2F4BEB',
          hover: '#2439C4',
          soft: '#EEF1FE',
          soft2: '#E2E7FD',
        },
        good: {
          DEFAULT: '#158F4A',
          soft: '#E9F7EF',
        },
        bad: {
          DEFAULT: '#D92D20',
          soft: '#FDEDEC',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display': ['2.75rem', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-sm': ['2.125rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '22px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
        card: '0 1px 2px rgba(15,23,42,0.04), 0 1px 1px rgba(15,23,42,0.03)',
        raised: '0 12px 32px -12px rgba(18, 20, 28, 0.16)',
        popover: '0 20px 48px -12px rgba(18, 20, 28, 0.22)',
      },
      maxWidth: {
        content: '1180px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'count-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'count-in': 'count-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};

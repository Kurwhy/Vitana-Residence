/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F8F6',
          100: '#DCECE7',
          200: '#B9D9CF',
          300: '#8EC0B1',
          400: '#62A390',
          500: '#3F8773',
          600: '#2A6F5C',
          700: '#1B5E4B',
          800: '#164B3C',
          900: '#123D31',
        },
        ivory: '#FAFAF8',
        surface: '#FFFFFF',
        line: '#E5E7E2',
        'line-strong': '#CBD3CF',
        ink: '#18221F',
        muted: '#5A6662',
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'public-h1': ['42px', { lineHeight: '1.12', letterSpacing: '-0.025em', fontWeight: '700' }],
        'panel-h1': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['22px', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '700' }],
        h3: ['18px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.6' }],
        small: ['14px', { lineHeight: '1.5' }],
      },
      borderRadius: {
        btn: '8px',
        card: '12px',
        modal: '14px',
      },
      boxShadow: {
        'card-hover': '0 12px 30px -18px rgba(24, 34, 31, 0.28)',
        dropdown: '0 10px 24px -16px rgba(24, 34, 31, 0.25)',
        modal: '0 24px 60px -28px rgba(24, 34, 31, 0.35)',
      },
      maxWidth: {
        prose: '70ch',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
}

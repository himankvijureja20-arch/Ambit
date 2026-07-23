/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand — Electric Indigo
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          DEFAULT: '#4F46E5',
        },
        // Dark backgrounds — Deep Midnight Indigo
        navy: {
          950: '#1E1B4B',
          900: '#312E81',
          800: '#3730A3',
          DEFAULT: '#312E81',
        },
        // Surfaces & text
        app: '#F8F7FF',        // Lavender-tinted white
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1A1635',  // Near-black with indigo undertone
          secondary: '#4B4869',
          tertiary: '#8B87A8',
        },
        line: {
          DEFAULT: '#DDD6FE',  // Violet-200 — input & control borders
          subtle: '#F1EFFB',   // Near-invisible card borders / dividers
        },
        // Status / trust
        sage: {
          bg: '#D1FAE5',
          text: '#065F46',
          deep: '#022C22',
        },
        // Secondary accent — Warm Lavender
        olive: {
          DEFAULT: '#A78BFA',
          dark: '#7C3AED',
        },
        // Success / trust indicator
        success: {
          DEFAULT: '#10B981',
          bg: '#D1FAE5',
          text: '#065F46',
        },
        // Amber — warmth & celebration accent
        sky: {
          50: '#EEF2FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          DEFAULT: '#4F46E5',
        },
        amber: {
          DEFAULT: '#F59E0B',
          bg: '#FEF3C7',
          text: '#92400E',
        },
        danger: {
          DEFAULT: '#EF4444',
          bg: '#FEE2E2',
        },
        info: {
          bg: '#EDE9FE',
          soft: '#DDD6FE',
          text: '#4C1D95',
        },
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        phone: '44px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(79, 70, 229, 0.08), 0 1px 2px rgba(79, 70, 229, 0.05)',
        cta: '0 4px 14px -2px rgba(79, 70, 229, 0.4), 0 2px 6px -2px rgba(79, 70, 229, 0.2)',
        raised: '0 10px 24px -4px rgba(79, 70, 229, 0.15), 0 4px 8px -4px rgba(79, 70, 229, 0.1)',
        phone: '0 30px 60px rgba(30, 27, 75, 0.45), 0 0 0 1px rgba(30, 27, 75, 0.15)',
      },
      maxWidth: {
        mobile: '448px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
        slideUp: 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

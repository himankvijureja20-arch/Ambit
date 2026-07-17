/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand — Warm Terracotta (CTAs, highlights)
        primary: {
          50: '#FAF0ED',
          100: '#F3D5CB',
          500: '#C85A3A',
          600: '#B04E31',
          700: '#8D3D26',
          DEFAULT: '#C85A3A',
        },
        // Dark backgrounds — Deep Charcoal (forest-green-charcoal)
        navy: {
          950: '#1F2E28',
          900: '#2D3A34',
          800: '#3D4E46',
          DEFAULT: '#2D3A34',
        },
        // Surfaces & text
        app: '#F1F5F0',        // Soft Sage Green background
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#2D3A34',  // Deep Charcoal
          secondary: '#556B60',
          tertiary: '#8BA098',
        },
        line: {
          DEFAULT: '#A8B5A3',  // Neutral Medium
          subtle: '#E8ECE7',   // Pale Sage
        },
        // Status / trust
        sage: {
          bg: '#DCF0E7',       // Light mint — verified badges
          text: '#2D5E4A',
          deep: '#1F3D2E',
        },
        // Secondary accent — Muted Olive
        olive: {
          DEFAULT: '#8B9D6B',
          dark: '#6B7D50',
        },
        // Success / trust indicator
        success: {
          DEFAULT: '#6BA587',
          bg: '#E4F4EC',
          text: '#1F5C3E',
        },
        // Links & secondary interactive (Terracotta-family for consistency)
        sky: {
          50: '#FAF0ED',
          500: '#C85A3A',
          600: '#B04E31',
          700: '#8D3D26',
          DEFAULT: '#C85A3A',
        },
        amber: {
          DEFAULT: '#FFBF00',
          bg: '#FEF3C7',
          text: '#92400E',
        },
        danger: {
          DEFAULT: '#BA1A1A',
          bg: '#FFDAD6',
        },
        info: {
          bg: '#E8ECE7',
          soft: '#DCF0E7',
          text: '#2D5E4A',
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
        card: '0 1px 3px rgba(45, 58, 52, 0.08), 0 1px 2px rgba(45, 58, 52, 0.06)',
        cta: '0 4px 6px -1px rgba(200, 90, 58, 0.25), 0 2px 4px -2px rgba(200, 90, 58, 0.15)',
        raised: '0 10px 15px -3px rgba(45, 58, 52, 0.12), 0 4px 6px -4px rgba(45, 58, 52, 0.08)',
        phone: '0 30px 60px rgba(31, 46, 40, 0.45), 0 0 0 1px rgba(31, 46, 40, 0.15)',
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

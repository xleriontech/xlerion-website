/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/components/**/*.{js,jsx}',
    './src/pages/**/*.{js,jsx}',
    './src/sections/**/*.{js,jsx}',
    './src/hooks/**/*.{js,jsx}',
    './src/main.jsx',
    './src/App.jsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00e9fa',
          dark: '#00b8c9',
          light: '#33edfb',
          50: 'rgba(0, 233, 250, 0.05)',
          100: 'rgba(0, 233, 250, 0.1)',
          200: 'rgba(0, 233, 250, 0.2)',
          300: 'rgba(0, 233, 250, 0.3)',
          400: 'rgba(0, 233, 250, 0.4)',
          500: 'rgba(0, 233, 250, 0.5)',
        },
        secondary: {
          DEFAULT: '#1a1a2e',
          light: '#252542',
          dark: '#0f0f1a',
        },
        accent: {
          DEFAULT: '#e94560',
          light: '#ff6b81',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          light: '#16162a',
          dark: '#0a0a12',
        },
        muted: {
          DEFAULT: '#6b7280',
          light: '#9ca3af',
          dark: '#4b5563',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
        work: ['Work Sans', 'sans-serif'],
      },
      borderRadius: {
        'xl-sm': '4px',
        'xl-md': '8px',
        'xl-lg': '12px',
        'xl-xl': '16px',
      },
      spacing: {
        'section': '6rem',
        'section-lg': '8rem',
        'container': '80rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 233, 250, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 233, 250, 0.2)',
        'glow-hover': '0 0 30px rgba(0, 233, 250, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 233, 250, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 233, 250, 0.3)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

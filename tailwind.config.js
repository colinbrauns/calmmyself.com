/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        calm: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        grounding: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        warm: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d2ce',
          300: '#f4ada6',
          400: '#ec7e73',
          500: '#e05545',
          600: '#cd3a29',
          700: '#ac2e1f',
          800: '#8e291d',
          900: '#76271e',
        }
      },
      animation: {
        'breathe-in': 'breathe-in 4s ease-in-out',
        'breathe-out': 'breathe-out 4s ease-in-out',
        'pulse-calm': 'pulse-calm 2s ease-in-out infinite',
        'blob-drift': 'blob-drift 30s ease-in-out infinite',
        'blob-drift-reverse': 'blob-drift-reverse 35s ease-in-out infinite',
        'blob-drift-slow': 'blob-drift-slow 40s ease-in-out infinite',
      },
      keyframes: {
        'breathe-in': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.2)' }
        },
        'breathe-out': {
          '0%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        'pulse-calm': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'blob-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(20px, -30px) scale(1.05)' },
          '50%': { transform: 'translate(-10px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(30px, 10px) scale(1.02)' },
        },
        'blob-drift-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-25px, 15px) scale(0.97)' },
          '50%': { transform: 'translate(15px, -25px) scale(1.04)' },
          '75%': { transform: 'translate(-20px, -10px) scale(0.98)' },
        },
        'blob-drift-slow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(10px, -20px) scale(1.03)' },
          '66%': { transform: 'translate(-15px, 10px) scale(0.97)' },
        },
      }
    },
  },
  plugins: [],
}

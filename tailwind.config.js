/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
        }
      },
      animation: {
        'breathe-in': 'breathe-in 4s ease-in-out',
        'breathe-out': 'breathe-out 4s ease-in-out',
        'pulse-calm': 'pulse-calm 2s ease-in-out infinite',
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
        }
      }
    },
  },
  plugins: [],
}
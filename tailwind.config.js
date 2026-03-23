/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Patrick Hand"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
        hand: ['"Patrick Hand"', 'cursive'],
      },
      colors: {
        water: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        heart: {
          DEFAULT: '#dc2626',
          light: '#fca5a5',
          glow: '#f87171',
        },
        warmth: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'snow-fall': 'snowFall 10s linear infinite',
        'sketch': 'sketch 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        snowFall: {
          '0%': { transform: 'translateY(-10vh) translateX(0)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) translateX(20px)', opacity: '0.3' },
        },
        sketch: {
          '0%, 100%': { filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.1))' },
          '50%': { filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.08))' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

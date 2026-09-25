/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          teal: '#31AAA9',
          'teal-dark': '#248685',
          'teal-light': '#48C2C1',
          cream: '#F8E0A4',
          'cream-light': '#FFF8E7',
          'cream-paper': '#FDF4DC',
          'cream-dark': '#E6CA85',
          'cream-border': '#E4C882',
          crimson: '#A82020',
          'crimson-dark': '#831919',
          'crimson-light': '#C42D2D',
          maroon: '#6C1A1A',
          'maroon-dark': '#4D1212',
          'maroon-light': '#8C2626'
        },
        slate: {
          850: '#151e2e',
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

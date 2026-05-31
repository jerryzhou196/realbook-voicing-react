/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        book: ['"Libre Baskerville"', 'Georgia', 'serif'],
        display: ['Caveat', 'cursive'],
      },
      colors: {
        paper: '#f1e5c3',
        ink: '#292118',
        leather: '#30261c',
        parchment: '#ead6aa',
      },
    },
  },
  plugins: [],
};

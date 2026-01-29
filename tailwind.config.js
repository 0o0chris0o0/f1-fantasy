/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        f1: ['Formula1', 'sans-serif'],
        sans: ['"Reddit Sans"', 'sans-serif'],
      },
      colors: {
        common: '#f5f5f5',
        uncommon: '#a1e9ff',
        rare: '#f128ff',
        legendary: '#ffc927',
      }
    },
  },
  plugins: [],
}


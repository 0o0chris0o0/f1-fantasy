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
    },
  },
  plugins: [],
}


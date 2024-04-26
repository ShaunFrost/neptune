/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['"Jersey 25"'],
        anton: ['"Anton"']
      }
    }
  },
  plugins: []
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['"Jersey 25"'],
        anton: ['"Anton"']
      },
      keyframes: {
        buttonscaleup: {
          '100%': { transform: 'scale(1.15)' }
        }
      },
      animation: {
        buttonscaleup: 'buttonscaleup 0.4s ease-in forwards'
      }
    }
  },
  plugins: []
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2e7d32', // eco-green
          lightGreen: '#4caf50',
          darkBlue: '#1a237e', // dark blue for contrast
          earth: '#d7ccc8', // soft earthy
          earthDark: '#8d6e63',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

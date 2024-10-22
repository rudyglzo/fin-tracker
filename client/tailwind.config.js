/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563eb', // blue-600
          dark: '#60a5fa',  // blue-400
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
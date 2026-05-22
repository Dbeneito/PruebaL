/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'liminal-white': '#f2f2f2',
        'liminal-black': '#0c0c0c',
        'liminal-green': '#15e012',
      },
      fontFamily: {
        principal: ['Oswald', 'sans-serif'],
        secundaria: ['NB Akademie Mono Std', 'monospace'],
      },
    },
  },
  plugins: [],
}
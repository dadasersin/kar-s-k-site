/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0d59f2',
        brandDark: '#050505',
        surface: '#111111',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        'custom': '8px',
      }
    },
  },
  plugins: [],
}

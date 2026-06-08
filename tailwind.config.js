/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: '#192433',
        sidebar: '#0F172A',
        'ejjar-navy': '#192433',
        'ejjar-gold': '#BB8D5A',
      },
    },
  },
  plugins: [],
}

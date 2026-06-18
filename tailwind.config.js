/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ror-dark': '#0d0d0d',
        'ror-card': 'rgba(30, 30, 30, 0.95)',
        'ror-accent': '#ffcc00',
        'ror-accent-hover': '#e6b800',
        'ror-muted': '#aaaaaa',
        'ror-border': 'rgba(255,255,255,0.1)',
      }
    },
  },
  plugins: [],
}

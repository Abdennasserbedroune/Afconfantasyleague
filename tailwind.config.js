/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F14',
          surface: '#111826',
          surface2: '#1A2636',
          border: '#2D3F54',
        },
        text: {
          primary: '#EAF0F6',
          secondary: '#A9B4C1',
        },
        accent: {
          gold: '#E0B700',
          green: '#189E4B',
          red: '#D21034',
          blue: '#1D4ED8',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

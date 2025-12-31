/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
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
        heading: ['system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xl': ['32px', { lineHeight: '1.2' }],
        'lg': ['24px', { lineHeight: '1.3' }],
        'md': ['16px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'xs': ['12px', { lineHeight: '1.5' }],
      },
      animation: {
        'pulse-red': 'pulse-red 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
}

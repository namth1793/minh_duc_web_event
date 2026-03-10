/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A96E',
        'gold-light': '#E8D5B0',
        'gold-dark': '#A8844A',
        cream: '#F5F0E8',
        'cream-dark': '#EDE6D6',
        dark: '#1a1a1a',
        warm: '#8B7355',
        'warm-light': '#B5A08A',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        'extra-wide': '0.2em',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A96E 0%, #A8844A 100%)',
      },
    },
  },
  plugins: [],
};

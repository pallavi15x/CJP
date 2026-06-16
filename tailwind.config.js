/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          card: '#1f1f1f',
          border: '#2a2a2a',
          hover: '#252525',
        },
        primary: {
          DEFAULT: '#FFC107',
          hover: '#FFB300',
          dark: '#E6A800',
        },
        secondary: {
          DEFAULT: '#C0392B',
          hover: '#A93226',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          muted: '#808080',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};

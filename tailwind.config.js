/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'primary': {
            DEFAULT: '#B799FF',
            50: '#FFFFFF',
            100: '#FFFFFF',
            200: '#FFFFFF',
            300: '#F1EBFF',
            400: '#D4C2FF',
            500: '#B799FF',
            600: '#8F61FF',
            700: '#6829FF',
            800: '#4600F0',
            900: '#3600B8',
            950: '#2E009C'
        },
      }
    },
  },
  plugins: [],
}

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
        'img': 'url(../public/background.jpg)',
      },
      colors: {
        'lime-custom': '#a0d382',
      },
      width: {
        'w50': '50%',
        'w10': '10%',
      },
      height: {
        'h50': '50%',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        'robo': 'Roboto Mono',
      },
      accent: {
        'lime-custom': '#a0d382',
      },
    },
  },
  plugins: [],
}

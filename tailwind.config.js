/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff6b35',
          50: '#fff7f5',
          100: '#ffede8',
          200: '#ffd9cc',
          300: '#ffbfa5',
          400: '#ff9b73',
          500: '#ff6b35',
          600: '#f04e1a',
          700: '#d63c0f',
          800: '#b5320f',
          900: '#942d14',
        },
        accent: '#4ecdc4',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Hiragino Mincho Pro', 'ヒラギノ明朝 Pro W3', 'HGS明朝E', 'ＭＳ Ｐ明朝', 'MS PMincho', 'serif'],
      },
    },
  },
  plugins: [],
}
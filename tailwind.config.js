/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#070b12',
          900: '#0c121c',
          800: '#121a27',
          700: '#1c2636',
        },
        mint: '#3ee0b0',
        lilac: '#8d7cf8',
        danger: '#ff5d73',
        warn: '#e2b15a',
        mist: '#a8b3c4',
      },
    },
  },
  plugins: [],
}

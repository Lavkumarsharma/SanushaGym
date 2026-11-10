/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          black: '#000000',
          dark: '#0A0A0A',
          card: '#111111',
          green: '#10B981',
          yellow: '#FBBF24',
          red: '#EF4444',
          blue: '#3B82F6',
          orange: '#F59E0B',
          gray: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        rounded: ['"SF Pro Rounded"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

module.exports = config

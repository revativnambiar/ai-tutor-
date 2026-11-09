/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eduora: {
          navy: {
            DEFAULT: '#0F172A',
            deep: '#090D16',
            subtle: '#1E293B',
            muted: '#475569',
          },
          purple: {
            50: '#FAF7FD',
            100: '#F4F0FF',
            200: '#EBE5FC',
            300: '#D7CBF8',
            400: '#B59EF2',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
          },
          blue: {
            50: '#F0F9FF',
            100: '#E0F2FE',
            200: '#BAE6FD',
            400: '#38BDF8',
            500: '#0EA5E9',
            600: '#0284C7',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'soft-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(14, 165, 233, 0.25)',
      }
    },
  },
  plugins: [],
}


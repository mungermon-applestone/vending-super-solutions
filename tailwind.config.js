
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          600: '#0284c7',
          800: '#075985',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        vending: {
          'blue': '#0066B3',
          'blue-dark': '#004B85',
          'blue-light': '#EBF3FB',
          'teal': '#00A0B0',
          'teal-light': '#E6F7F9',
          'gray': '#F8F9FA',
          'gray-dark': '#4A5568',
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))'
      },
    },
  },
  plugins: [],
}

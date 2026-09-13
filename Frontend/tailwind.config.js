/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF8F0',
        sidebar: {
          DEFAULT: '#FFFFFF',
          hover: '#FBEEF1',
          active: '#7C2D48',
        },
        brand: {
          50: '#FBEEF1',
          100: '#F3D6DE',
          500: '#7C2D48',
          600: '#622339',
          700: '#4A1A2B',
        },
        teal: {
          50: '#E8F8F6',
          100: '#CBEFEA',
          500: '#45B8AC',
          600: '#379288',
        },
        amber: {
          50: '#FEF3E0',
          100: '#FCE2B8',
          500: '#F5A623',
          600: '#D68F13',
        },
        sky: {
          50: '#EAF4FB',
          100: '#CFE7F5',
          500: '#4A90C2',
          600: '#3B77A3',
        },
        ink: {
          900: '#2D2A26',
          700: '#5C554E',
          500: '#8C8479',
          300: '#DDD4C8',
          100: '#F5EFE5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(45, 42, 38, 0.08), 0 1px 2px rgba(45, 42, 38, 0.04)',
      },
      borderRadius: {
        xl2: '14px',
      },
    },
  },
  plugins: [],
}

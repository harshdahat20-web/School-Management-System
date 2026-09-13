/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F3F1FC',
        sidebar: {
          DEFAULT: '#FFFFFF',
          hover: '#F3F1FC',
          active: '#F2603D',
        },
        brand: {
          50: '#FDEDE9',
          100: '#FBD9D0',
          500: '#F2603D',
          600: '#D94F2E',
          700: '#B23F24',
        },
        indigo: {
          50: '#EFEDFC',
          100: '#DDD8F9',
          500: '#6C5DD3',
          600: '#5847B8',
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
          900: '#1E1B2C',
          700: '#5B5670',
          500: '#8D89A0',
          300: '#D6D3E3',
          100: '#F1EFFA',
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

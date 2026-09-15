/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        cream: "#F0EFEB",
        background: "#F0EFEB",

        sidebar: {
          DEFAULT: "#064E3B",
          hover: "#0B6B52",
          active: "#F59E0B",
          text: "#FFFFFF",
          muted: "#FFFFFF",
        },

        brand: {
          50: "#E6F4EF",
          100: "#C2E4D6",
          500: "#064E3B",
          600: "#053D2F",
          700: "#032A21",
        },

        indigo: {
          50: "#EEEEFA",
          100: "#E1E0F5",
          500: "#5046E5",
          600: "#4638D5",
          700: "#392DB5",
        },

        success: {
          50: "#EDECF8",
          100: "#E2E1F2",
          500: "#5046E5",
        },

        warning: {
          50: "#F9E9E4",
          100: "#F3D7D0",
          500: "#D95C3F",
        },

        ink: {
          900: "#19172A",
          800: "#242238",
          700: "#353246",
          500: "#625F70",
          400: "#817E8E",
          300: "#D0CED5",
          200: "#DEDCE2",
          100: "#E9E8EC",
        },

        input: {
          border: "#D4D2D8",
          focus: "#5046E5",
          placeholder: "#817E8E",
        },
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      boxShadow: {
        card: "0 2px 8px rgba(33, 30, 84, 0.06)",
        soft: "0 4px 16px rgba(33, 30, 84, 0.08)",
      },

      borderRadius: {
        xl2: "14px",
        "2xl": "16px",
      },
    },
  },

  plugins: [],
};

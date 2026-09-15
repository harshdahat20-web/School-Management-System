/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        // =========================
        // Main Background
        // =========================
        cream: "#F0EFEB",
        background: "#F0EFEB",

        // =========================
        // Sidebar
        // =========================
        sidebar: {
          DEFAULT: "#211E54",
          hover: "#2B2766",
          active: "#FF7518",
          text: "#FFFFFF",
          muted: "#D8D6F0",
        },

        // =========================
        // Brand / Orange
        // =========================
        brand: {
          50: "#FFF1E5",
          100: "#FFDEC2",
          500: "#FF7518",
          600: "#F26300",
          700: "#D95400",
        },

        // =========================
        // Purple / Indigo
        // =========================
        indigo: {
          50: "#EEEEFA",
          100: "#E1E0F5",
          500: "#5046E5",
          600: "#4638D5",
          700: "#392DB5",
        },

        // =========================
        // Success / Students Card
        // =========================
        success: {
          50: "#EDECF8",
          100: "#E2E1F2",
          500: "#5046E5",
        },

        // =========================
        // Warning / Pending Card
        // =========================
        warning: {
          50: "#F9E9E4",
          100: "#F3D7D0",
          500: "#D95C3F",
        },

        // =========================
        // Text
        // =========================
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

        // =========================
        // Form / Input
        // =========================
        input: {
          border: "#D4D2D8",
          focus: "#5046E5",
          placeholder: "#817E8E",
        },
      },

      // =========================
      // Font
      // =========================
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      // =========================
      // Shadows
      // =========================
      boxShadow: {
        card: "0 2px 8px rgba(33, 30, 84, 0.06)",
        soft: "0 4px 16px rgba(33, 30, 84, 0.08)",
      },

      // =========================
      // Border Radius
      // =========================
      borderRadius: {
        xl2: "14px",
        "2xl": "16px",
      },
    },
  },

  plugins: [],
};

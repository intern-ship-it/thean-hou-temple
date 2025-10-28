/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Chinese Temple Theme - Primary Red
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // Sacred Gold/Amber
        secondary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          "0%": {
            transform: "translateY(-10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideInRight: {
          "0%": {
            transform: "translateX(-10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        glow: {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 30px rgba(251, 191, 36, 0.8)",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "temple-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(251,191,36,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        glow: "0 0 15px rgba(251, 191, 36, 0.5)",
        "glow-lg": "0 0 30px rgba(251, 191, 36, 0.6)",
        "glow-red": "0 0 15px rgba(185, 28, 28, 0.5)",
        "glow-red-lg": "0 0 30px rgba(185, 28, 28, 0.6)",
        "inner-glow": "inset 0 0 20px rgba(251, 191, 36, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionDuration: {
        2000: "2000ms",
        3000: "3000ms",
      },
      scale: {
        102: "1.02",
      },
    },
  },
  plugins: [
    // Optional: Add scrollbar styling
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
        ".scrollbar-thumb-amber-700": {
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#b45309",
            borderRadius: "9999px",
          },
        },
        ".scrollbar-track-red-900": {
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(127, 29, 29, 0.5)",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

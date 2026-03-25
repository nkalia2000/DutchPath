import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#003DA5",
          50: "#e6edf8",
          100: "#c0d0ef",
          200: "#97b1e4",
          300: "#6d91d9",
          400: "#4d79d1",
          500: "#2d61c9",
          600: "#1f53bb",
          700: "#0f42a6",
          800: "#003DA5",
          900: "#002d7a",
        },
        accent: {
          DEFAULT: "#FF6B00",
          50: "#fff3e6",
          100: "#ffe0bf",
          200: "#ffcc94",
          300: "#ffb769",
          400: "#ffa247",
          500: "#FF6B00",
          600: "#e65f00",
          700: "#cc5300",
          800: "#b34700",
          900: "#993b00",
        },
        background: "#FFF8F0",
        success: "#00A86B",
        danger: "#D63B3B",
        gold: "#FFD700",
        cream: "#FFF8F0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
      },
      animation: {
        "float-up": "floatUp 1s ease-out forwards",
        "shake": "shake 0.5s ease-in-out",
        "pulse-flame": "pulseFlame 2s ease-in-out infinite",
        "slide-up": "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "draw-path": "drawPath 1.5s ease-in-out forwards",
        "heart-break": "heartBreak 0.5s ease-in-out forwards",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        floatUp: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-60px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-6px)" },
          "80%": { transform: "translateX(6px)" },
        },
        pulseFlame: {
          "0%, 100%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.08)", filter: "brightness(1.15)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.7)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        drawPath: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        heartBreak: {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.3)" },
          "60%": { transform: "scale(0.8) rotate(10deg)" },
          "100%": { transform: "scale(0) rotate(20deg)", opacity: "0" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;

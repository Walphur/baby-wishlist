import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#F4F6F1",
          100: "#E7ECE0",
          200: "#D3DCC5",
          300: "#B8C7A2",
          400: "#9CAF88",
          500: "#83996E",
          600: "#697D58",
          700: "#526145",
          800: "#3E4A34",
          900: "#2C3626",
        },
        cream: {
          50: "#FFFEFC",
          100: "#F5F1E8",
          200: "#EDE6D8",
          300: "#E3D8C4",
        },
        gold: {
          400: "#D8BD8A",
          500: "#C9A664",
          600: "#B08F4F",
        },
        blush: {
          100: "#F6E4DE",
          200: "#EFCFC5",
          300: "#E4B3A4",
          400: "#D69682",
        },
        terracotta: {
          400: "#C97C5D",
          500: "#B8663F",
        },
        ink: {
          700: "#4A463D",
          800: "#3A362E",
          900: "#2B2822",
        },
      },
      fontFamily: {
        serif: ["var(--font-heading)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-3deg)" },
          "50%": { transform: "translateY(-16px) rotate(3deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delay": "float 7s ease-in-out infinite 1.5s",
      },
    },
  },
  plugins: [],
};
export default config;

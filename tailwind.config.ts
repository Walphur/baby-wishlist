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
        ink: {
          700: "#4A463D",
          800: "#3A362E",
          900: "#2B2822",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;

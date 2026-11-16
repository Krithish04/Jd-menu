import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1B6B3A",
          "green-hover": "#165930",
          "green-dark": "#124A28",
          maroon: "#8E1B22",
          "maroon-hover": "#74161b",
          "maroon-binder": "#5E0F18",
          cream: "#FBF1EC",
          "cream-light": "#FFFDF9",
          "cream-dark": "#EFE3DC",
          gold: "#C9A24B",
          "gold-light": "#DFC27A",
          text: "#1E1E1E",
          muted: "#66605C",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 150ms ease-out",
        slideInLeft: "slideInLeft 200ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;

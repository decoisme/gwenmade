import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f5f3ed",
        panel: "#ebe8df",
        ink: "#24221f",
        accent: "#bd4c31",
        warm: "#d99b83",
        rule: "#d8d3c9",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        editorial: ["Instrument Serif", "serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

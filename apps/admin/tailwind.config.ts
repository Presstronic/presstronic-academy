import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "var(--academy-graphite-950)",
          900: "var(--academy-graphite-900)",
          850: "var(--academy-graphite-850)",
          800: "var(--academy-graphite-800)",
          700: "var(--academy-graphite-700)",
          600: "var(--academy-graphite-600)",
          300: "var(--academy-graphite-300)",
          100: "var(--academy-graphite-100)",
        },
        cyan: {
          400: "var(--academy-cyan-400)",
          300: "var(--academy-cyan-300)",
          100: "var(--academy-cyan-100)",
        },
        volt: {
          300: "var(--academy-volt-300)",
          100: "var(--academy-volt-100)",
        },
        magenta: {
          400: "var(--academy-magenta-400)",
        },
      },
      transitionTimingFunction: {
        academy: "var(--academy-ease-out)",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Archivo", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

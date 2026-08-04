import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F8F9FE",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#5B3FD3",
          light: "#8B6FF7",
          foreground: "#ffffff",
        },
        sidebar: {
          DEFAULT: "#1E1248",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#75759E",
          foreground: "#1E1E2D",
        },
        destructive: {
          DEFAULT: "#FF2E55",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#2E7D32",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#E65100",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#3B82F6",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config

export default config

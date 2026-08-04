/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5B3FD3",
        secondary: "#8B6FF7",
        emergency: "#FF2E55",
        success: "#2E7D32",
        warning: "#E65100",
        background: "#F8F9FE",
        card: "#FFFFFF",
        textPrimary: "#1E1E2D",
        textSecondary: "#75759E"
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        round: "24px"
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        board: "#EEE7D6",
        paper: "#FFFCF4",
        ink: "#2B2420",
        inkfaint: "#8A7F6F",
        amber: "#D98E3E",
        sage: "#7C9473",
        coral: "#D2604A",
        dusk: "#5C7A94",
      },
      fontFamily: {
        display: ["Kalam", "cursive"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        note: "0 6px 14px -6px rgba(43, 36, 32, 0.35)",
        noteHover: "0 12px 22px -8px rgba(43, 36, 32, 0.45)",
      },
    },
  },
  plugins: [],
};

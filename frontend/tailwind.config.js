/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    // screens: {
    //   xs: "480px",
    //   ss: "620px",
    //   sm: "768px",
    //   md: "1060px",
    //   lg: "1200px",
    //   xl: "1700px",
    // },
  },
  plugins: [],
}


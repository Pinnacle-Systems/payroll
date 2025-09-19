/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
       poppins: ["Poppins", "sans-serif"], 
       sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

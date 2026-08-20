/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./user/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s infinite linear",
      },
      colors: {
        "brand-burgundy": "#3B070B",
      },
      fontFamily: {
        // Sets Cormorant Garamond as the primary font throughout your app
        serif: ['"Cormorant Garamond"', "serif"],
        cormorant: ['"Cormorant Garamond"', "serif"],
        marcellus: ['"Marcellus"', "serif"],
      },
    },
  },
  plugins: [],
};

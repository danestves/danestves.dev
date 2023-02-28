const path = require("path")

const defaultTheme = require("tailwindcss/defaultTheme")

const fromRoot = (p) => path.join(__dirname, p)

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [fromRoot("./app/**/*.+(js|jsx|ts|tsx|mdx|md)")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'SF Pro Display'", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

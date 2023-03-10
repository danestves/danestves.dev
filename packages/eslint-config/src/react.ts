import "@rushstack/eslint-patch/modern-module-resolution"

import type { Linter } from "eslint"

const config: Linter.Config = {
  extends: [
    "@danestves/eslint-config/node",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:tailwindcss/recommended",
  ],
  env: {
    browser: true,
  },
  plugins: ["react", "react-hooks", "jsx-a11y"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/display-name": "off",
    "react/jsx-filename-extension": "off",
    "react/jsx-sort-props": "error",
    "react/jsx-uses-react": "off",
    "react/no-unknown-property": [
      2,
      {
        ignore: ["fetchpriority"],
      },
    ],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": "error",
  },
}

module.exports = config

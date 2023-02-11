import "@rushstack/eslint-patch/modern-module-resolution"

import type { Linter } from "eslint"

const config: Linter.Config = {
  extends: ["eslint:recommended", "plugin:import/errors", "plugin:import/warnings", "prettier"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    requireConfigFile: false,
    ecmaVersion: "latest",
  },
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins: ["node", "import"],
  settings: {
    "import/ignore": ["node_modules", "\\.(css|md|svg|json)$"],
    "import/resolver": {
      "eslint-import-resolver-node": {
        extensions: [".js", ".jsx"],
      },
    },
  },
  rules: {
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/order": [
      "error",
      {
        "alphabetize": {
          order: "asc",
        },
        "groups": ["type", "builtin", "external", "internal", "parent", ["sibling", "index"]],
        "newlines-between": "always",
        "pathGroups": [],
        "pathGroupsExcludedImportTypes": [],
      },
    ],
    "sort-imports": [
      "error",
      {
        allowSeparatedGroups: true,
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        warnOnUnsupportedTypeScriptVersion: true,
      },
      plugins: ["@typescript-eslint"],
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"],
        },
        "import/resolver": {
          "eslint-import-resolver-typescript": {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            ignoreRestSiblings: true,
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
}

module.exports = config

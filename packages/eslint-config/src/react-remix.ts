import "@rushstack/eslint-patch/modern-module-resolution"

import type { Linter } from "eslint"

const config: Linter.Config = {
  extends: ["@danestves/eslint-config/react", "@remix-run"],
}

module.exports = config

import type { RichTextCustomElement } from "payload/types"

import Button from "./button"
import Element from "./element"
import withLabel from "./plugin"

export default {
  name: "label",
  Button,
  Element,
  plugins: [withLabel],
} as RichTextCustomElement

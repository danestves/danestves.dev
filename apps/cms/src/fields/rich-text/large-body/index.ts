import type { RichTextCustomElement } from "payload/types"

import Button from "./button"
import Element from "./element"
import withLargeBody from "./plugin"

export default {
  name: "large-body",
  Button,
  Element,
  plugins: [withLargeBody],
} as RichTextCustomElement

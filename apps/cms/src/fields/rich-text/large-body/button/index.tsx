import { ElementButton } from "payload/components/rich-text"
import React from "react"

import Icon from "../icon"

const baseClass = "rich-text-large-body-button"

const ToolbarButton: React.FC<{ path: string }> = () => (
  <ElementButton className={baseClass} format="large-body">
    <Icon />
  </ElementButton>
)

export default ToolbarButton

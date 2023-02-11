import Textarea from "payload/dist/admin/components/forms/field-types/Textarea"
import React from "react"

import "./index.scss"

export const BlogMarkdownField: React.FC<{ path: string; name: string }> = ({ path, name }) => {
  return (
    <div className="markdown">
      <Textarea name={name} path={path} required />
    </div>
  )
}
